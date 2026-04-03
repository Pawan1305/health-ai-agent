const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const Conversation = require('../models/Conversation');

// ── AI Clients ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
    'X-Title': 'MediMind AI',
  },
});

// Free models available on OpenRouter (no credit card required)
const OPENROUTER_FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
  'google/gemma-3-27b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
];

const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

/**
 * Returns the active provider and model from environment variables.
 * AI_PROVIDER=gemini | openrouter
 * OPENROUTER_MODEL=<model-id>  (only relevant when AI_PROVIDER=openrouter)
 */
function getActiveProvider() {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();
  const validProviders = ['gemini', 'openrouter'];
  const activeProvider = validProviders.includes(provider) ? provider : 'gemini';
  const activeModel = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL;
  return { activeProvider, activeModel };
}

/**
 * Builds the system prompt for MediMind with optional medical context.
 * Used by both Gemini and OpenRouter.
 */
const buildSystemPrompt = (medicalContext) => {
  const base = `You are MediMind, an advanced AI healthcare assistant. Your mission is to provide accurate, compassionate, and clearly explained medical information.

CORE RESPONSIBILITIES:
- Answer health-related questions clearly and accurately
- Explain symptoms, conditions, medications, and treatments
- Offer preventive health advice and wellness guidance
- Help users understand medical terminology in plain language
- Guide users on when to seek urgent professional medical care

RESPONSE FORMATTING:
- Use markdown formatting: headers (##), bullet points, bold text for key terms
- Break long answers into clear sections
- Highlight urgent warning signs with ⚠️ emoji when applicable
- Keep a warm, empathetic, reassuring tone

IMPORTANT SAFETY RULES:
- Always conclude by recommending the user consult a qualified healthcare professional
- Never provide a definitive diagnosis — frame everything as educational information
- Flag symptoms requiring immediate emergency care (chest pain, difficulty breathing, etc.)
- Do not prescribe medications or specific dosages`;

  if (medicalContext && medicalContext.trim()) {
    return `${base}

---
PATIENT MEDICAL CONTEXT (use this to personalize all responses):
${medicalContext.trim()}
---

Always consider the above context when answering questions. Reference relevant parts of the context when appropriate.`;
  }

  return base;
};

// ── Gemini Streaming Handler ─────────────────────────────────────────────
async function streamGemini({ message, conversation, medicalContext, res }) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: buildSystemPrompt(medicalContext),
  });

  const history = conversation.messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 2048, temperature: 0.7, topP: 0.85, topK: 40 },
  });

  const result = await chat.sendMessageStream(message);
  let fullResponse = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`);
    }
  }
  return fullResponse;
}

// ── OpenRouter Streaming Handler ─────────────────────────────────────────
async function streamOpenRouter({ message, conversation, medicalContext, model, res }) {
  const selectedModel = OPENROUTER_FREE_MODELS.includes(model) ? model : DEFAULT_OPENROUTER_MODEL;

  const messages = [
    { role: 'system', content: buildSystemPrompt(medicalContext) },
    ...conversation.messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    })),
    { role: 'user', content: message },
  ];

  const stream = await openRouterClient.chat.completions.create({
    model: selectedModel,
    messages,
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  });

  let fullResponse = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) {
      fullResponse += text;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`);
    }
  }
  return fullResponse;
}

// ── POST /api/chat/send ──────────────────────────────────────────────────
router.post('/send', async (req, res) => {
  const {
    message,
    conversationId,
    medicalContext,
  } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  // Provider is always determined by .env — client cannot override this
  const { activeProvider, activeModel } = getActiveProvider();

  // Validate the configured provider has a key
  if (activeProvider === 'openrouter' && !process.env.OPENROUTER_API_KEY?.startsWith('sk-or')) {
    return res.status(400).json({
      error: 'AI_PROVIDER is set to openrouter but OPENROUTER_API_KEY is missing or invalid in backend/.env',
    });
  }
  if (activeProvider === 'gemini' && !process.env.GEMINI_API_KEY?.startsWith('AIza')) {
    return res.status(400).json({
      error: 'AI_PROVIDER is set to gemini but GEMINI_API_KEY is missing or invalid in backend/.env',
    });
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      const titleText = message.trim();
      conversation = new Conversation({
        title: titleText.length > 70 ? titleText.substring(0, 67) + '...' : titleText,
        messages: [],
      });
      // Save immediately so the ID exists in MongoDB before the meta event is emitted.
      // The frontend navigates to /chat/:id as soon as it receives meta, and immediately
      // fetches GET /api/chat/:id — so the document must already be persisted.
      await conversation.save();
    }

    // Send metadata event first
    res.write(
      `data: ${JSON.stringify({
        type: 'meta',
        conversationId: conversation._id.toString(),
        conversationTitle: conversation.title,
        provider: activeProvider,
        model: activeProvider === 'openrouter' ? activeModel : 'gemini-2.0-flash',
      })}\n\n`
    );

    let fullResponse = '';

    if (activeProvider === 'openrouter') {
      fullResponse = await streamOpenRouter({
        message: message.trim(), conversation, medicalContext, model: activeModel, res,
      });
    } else {
      fullResponse = await streamGemini({
        message: message.trim(), conversation, medicalContext, res,
      });
    }

    // Persist to DB
    conversation.messages.push({ role: 'user', content: message.trim() });
    conversation.messages.push({ role: 'assistant', content: fullResponse });
    await conversation.save();

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error(`[${activeProvider}] stream error:`, error.message);

    let userMessage = 'An error occurred. Please try again.';
    if (activeProvider === 'openrouter') {
      if (error.status === 401 || error.message?.includes('auth')) {
        userMessage = 'Invalid OpenRouter API key. Check OPENROUTER_API_KEY in backend/.env';
      } else if (error.status === 429 || error.message?.includes('rate')) {
        userMessage = 'OpenRouter rate limit reached. Wait a moment and retry.';
      } else if (error.message?.includes('model')) {
        userMessage = 'Selected model is unavailable. Update OPENROUTER_MODEL in backend/.env';
      }
    } else {
      if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
        userMessage = 'Invalid Gemini API key. Check GEMINI_API_KEY in backend/.env';
      } else if (error.message?.includes('quota') || error.message?.includes('rate')) {
        userMessage = 'Gemini rate limit reached. Please wait and try again.';
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'error', message: userMessage })}\n\n`);
    res.end();
  }
});

// ── GET /api/chat/providers ──────────────────────────────────────────────
// Returns which providers have keys configured and which is currently active (from .env)
router.get('/providers', (req, res) => {
  const { activeProvider, activeModel } = getActiveProvider();
  res.json({
    activeProvider,
    activeModel: activeProvider === 'openrouter' ? activeModel : 'gemini-2.0-flash',
    gemini: {
      configured: !!(process.env.GEMINI_API_KEY?.startsWith('AIza')),
      model: 'gemini-2.0-flash',
      label: 'Google Gemini 1.5 Flash',
    },
    openrouter: {
      configured: !!(process.env.OPENROUTER_API_KEY?.startsWith('sk-or')),
      activeModel,
      freeModels: OPENROUTER_FREE_MODELS,
    },
  });
});
// ── GET /api/chat/conversations ──────────────────────────────────────────
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .select('_id title createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations.' });
  }
});

/**
 * GET /api/chat/:id
 * Returns a full conversation with all messages.
 */
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found.' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversation.' });
  }
});

/**
 * DELETE /api/chat/:id
 * Deletes a conversation.
 */
router.delete('/:id', async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conversation deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation.' });
  }
});

module.exports = router;
