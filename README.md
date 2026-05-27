# 🏥 MediMind AI — Healthcare Multi-AI Agent

A full-stack MERN application featuring a healthcare assistant that queries **multiple AI models per user issue**, filters the useful output, and shows a single clear response with **real-time streaming UX** and **medical context personalization**.

---

## ✨ Features

- 🤖 **Dual-AI Q&A** — Combines ChatGPT + Gemini responses for better coverage
- 🏥 **Medical Context** — Personalize responses with your health profile
- ⚡ **Streaming Responses** — Real-time token-by-token response like ChatGPT
- 💬 **Conversation History** — Persist chats in MongoDB
- 🌙 **Premium Dark UI** — Glassmorphism, animated gradients, Framer Motion
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 📋 **Markdown Rendering** — Formatted AI responses with code blocks, tables, lists

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **AI** | ChatGPT + Gemini (combined output) |
| **Animations** | Framer Motion + CSS Animations |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### Step 1 — Get API Keys

1. Get Gemini key from **[Google AI Studio](https://aistudio.google.com/app/apikey)** (optional)
2. Get OpenAI key from **[OpenAI Platform](https://platform.openai.com/api-keys)** (optional)
3. Add at least one key (`GEMINI_API_KEY` or `OPENAI_API_KEY`)
4. For best results, configure both keys so responses can be cross-checked

> Note: API usage costs and limits depend on your OpenAI and Google accounts.

---

### Step 2 — Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
# Set at least one key: GEMINI_API_KEY or OPENAI_API_KEY
npm run dev
```

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the App

Visit `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
health-ai-agent/
├── backend/
│   ├── server.js              # Express server
│   ├── config/db.js           # MongoDB connection
│   ├── models/
│   │   └── Conversation.js    # Chat history model
│   ├── routes/
│   │   ├── chat.js            # AI chat + streaming
│   │   └── context.js         # Context validation
│   └── middleware/
│       └── errorHandler.js
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/AppContext.jsx   # Global state
    │   ├── services/api.js           # API + streaming
    │   ├── pages/
    │   │   ├── LandingPage.jsx       # Hero landing
    │   │   └── ChatPage.jsx          # Chat interface
    │   └── components/
    │       ├── ChatWindow.jsx
    │       ├── MessageBubble.jsx     # Markdown + streaming
    │       ├── InputArea.jsx
    │       ├── ConversationList.jsx
    │       └── TypingIndicator.jsx
    └── tailwind.config.js
```

---

## 🔧 Environment Variables

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medimind
GEMINI_API_KEY=AIza...your_key_here
OPENAI_API_KEY=sk-...your_key_here
OPENAI_MODEL=gpt-4o-mini
GEMINI_MODEL=gemini-1.5-flash-latest
SHOW_ENGINE_DIAGNOSTICS=false
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 💡 How It Works

1. **Add Medical Context** — Enter your age, conditions, medications, allergies
2. **Ask Questions** — Chat naturally about symptoms, medications, conditions
3. **AI Synthesis** — Multiple AI engines analyze your issue and a filtered answer is generated
4. **Stream & Save** — Responses stream in real-time and save to MongoDB

---

## ⚠️ Medical Disclaimer

> MediMind AI is for **educational purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.

---

## 📄 License

MIT — Built for resume showcase purposes.
# health-ai-agent
# health-ai-agent
