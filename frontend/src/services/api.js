const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL?.trim();
const BASE_URL = RAW_API_BASE
  ? RAW_API_BASE.replace(/\/$/, '')
  : '/api';

/**
 * Fetches the list of conversations.
 */
export async function fetchConversations() {
  const res = await fetch(`${BASE_URL}/chat/conversations`);
  if (!res.ok) throw new Error('Failed to load conversations');
  return res.json();
}

/**
 * Fetches a single conversation by ID.
 */
export async function fetchConversation(id) {
  const res = await fetch(`${BASE_URL}/chat/${id}`);
  if (!res.ok) throw new Error('Failed to load conversation');
  return res.json();
}

/**
 * Deletes a conversation by ID.
 */
export async function deleteConversation(id) {
  const res = await fetch(`${BASE_URL}/chat/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete conversation');
  return res.json();
}

/**
 * Sends a message and streams the response via SSE.
 * Backend analyzes multiple AI responses and streams the selected response.
 * Calls onMeta({ conversationId, conversationTitle, mode }) once,
 * then onChunk(text) for each streaming token,
 * then onDone() when complete, or onError(msg) on failure.
 */
export async function sendMessageStream({
  message,
  conversationId,
  medicalContext,
  onMeta,
  onChunk,
  onDone,
  onError,
}) {
  try {
    const response = await fetch(`${BASE_URL}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId, medicalContext }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Request failed' }));
      onError(err.error || 'Request failed');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;

        const raw = trimmed.slice(6);
        if (!raw) continue;

        try {
          const event = JSON.parse(raw);
          if (event.type === 'meta') {
            onMeta?.({ conversationId: event.conversationId, conversationTitle: event.conversationTitle });
          } else if (event.type === 'chunk') {
            onChunk?.(event.content);
          } else if (event.type === 'done') {
            onDone?.();
          } else if (event.type === 'error') {
            onError?.(event.message);
          }
        } catch {
          // malformed JSON — ignore
        }
      }
    }
  } catch (err) {
    onError?.(err.message || 'Network error. Is the server running?');
  }
}
