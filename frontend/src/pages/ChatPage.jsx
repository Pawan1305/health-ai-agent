import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { fetchConversations, fetchConversation, deleteConversation, sendMessageStream, fetchProviderStatus } from '../services/api.js';
import ConversationList from '../components/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import InputArea from '../components/InputArea.jsx';
import ContextModal from '../components/ContextModal.jsx';
import AISettingsModal from '../components/AISettingsModal.jsx';
import { Activity, Menu, X, Plus, BrainCircuit, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  // Load conversations list on mount
  useEffect(() => {
    fetchConversations()
      .then((convs) => dispatch({ type: 'SET_CONVERSATIONS', payload: convs }))
      .catch(console.error);
    // Fetch provider status from backend
    fetchProviderStatus()
      .then((status) => dispatch({ type: 'SET_PROVIDER_STATUS', payload: status }))
      .catch(console.error);
  }, []);

  // Load conversation from URL param.
  // Guard: skip fetch while a stream is in progress — onMeta already wired up the
  // new conversation ID, and re-fetching would overwrite the in-progress messages.
  useEffect(() => {
    if (id) {
      if (state.isLoading) return;
      fetchConversation(id)
        .then((conv) => {
          dispatch({
            type: 'SET_CURRENT_CONVERSATION',
            payload: {
              id: conv._id,
              messages: conv.messages.map((m) => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp,
              })),
            },
          });
        })
        .catch(() => navigate('/chat'));
    } else {
      dispatch({ type: 'NEW_CONVERSATION' });
    }
  }, [id]);

  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || state.isLoading) return;

      // Add user message immediately
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'user', content: text, timestamp: new Date().toISOString() },
      });
      dispatch({ type: 'SET_LOADING', payload: true });

      // Add placeholder AI message (streaming)
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { role: 'assistant', content: '', timestamp: new Date().toISOString(), isStreaming: true },
      });

      await sendMessageStream({
        message: text,
        conversationId: state.currentConversationId,
        medicalContext: state.medicalContext,

        onMeta: ({ conversationId, conversationTitle }) => {
          if (conversationId !== state.currentConversationId) {
            // Use SET_CONVERSATION_ID instead of SET_CURRENT_CONVERSATION so we
            // don't wipe the user + placeholder assistant messages already in state.
            dispatch({ type: 'SET_CONVERSATION_ID', payload: conversationId });
            dispatch({
              type: 'ADD_CONVERSATION',
              payload: { _id: conversationId, title: conversationTitle, updatedAt: new Date().toISOString() },
            });
            navigate(`/chat/${conversationId}`, { replace: true });
          } else {
            dispatch({
              type: 'ADD_CONVERSATION',
              payload: {
                _id: conversationId,
                title: conversationTitle,
                updatedAt: new Date().toISOString(),
              },
            });
          }
        },

        onChunk: (chunk) => {
          dispatch({ type: 'APPEND_TO_LAST_MESSAGE', payload: chunk });
        },

        onDone: () => {
          dispatch({ type: 'FINALIZE_LAST_MESSAGE' });
          dispatch({ type: 'SET_LOADING', payload: false });
          // Refresh conversations (update timestamps)
          fetchConversations()
            .then((convs) => dispatch({ type: 'SET_CONVERSATIONS', payload: convs }))
            .catch(console.error);
        },

        onError: (errMsg) => {
          dispatch({ type: 'APPEND_TO_LAST_MESSAGE', payload: `\n\n⚠️ **Error:** ${errMsg}` });
          dispatch({ type: 'FINALIZE_LAST_MESSAGE' });
          dispatch({ type: 'SET_LOADING', payload: false });
        },
      });
    },
    [state.currentConversationId, state.medicalContext, state.isLoading, navigate]
  );

  const handleDeleteConversation = async (convId) => {
    await deleteConversation(convId).catch(console.error);
    dispatch({ type: 'DELETE_CONVERSATION', payload: convId });
    if (state.currentConversationId === convId) {
      navigate('/chat');
    }
  };

  const handleSelectConversation = (convId) => {
    navigate(`/chat/${convId}`);
  };

  return (
    <div className="flex h-screen bg-[#080c14] overflow-hidden">

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {state.sidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-[260px] flex-shrink-0 bg-[#0a0f1e] border-r border-white/5 flex flex-col h-full z-30 lg:relative absolute"
          >
            {/* Logo */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Activity size={16} className="text-white" />
                </div>
                <span className="text-base font-bold gradient-text">MediMind</span>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                className="lg:hidden text-gray-500 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* New chat button */}
            <div className="p-4">
              <button
                onClick={() => { dispatch({ type: 'NEW_CONVERSATION' }); navigate('/chat'); }}
                className="w-full flex items-center gap-2.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/30 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm"
              >
                <Plus size={16} className="text-cyan-400" />
                New Conversation
              </button>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Recent Chats</span>
              </div>
              <div className="flex-1 overflow-y-auto px-2">
                <ConversationList
                  conversations={state.conversations}
                  currentId={state.currentConversationId}
                  onSelect={handleSelectConversation}
                  onDelete={handleDeleteConversation}
                />
              </div>
            </div>

            {/* Context & Settings */}
            <div className="p-4 border-t border-white/5 space-y-2">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CONTEXT_MODAL' })}
                className="w-full flex items-center gap-2.5 text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 py-2.5 px-4 rounded-xl transition-all"
              >
                <BrainCircuit size={16} />
                <span>Medical Context</span>
                {state.medicalContext && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" title="Context active" />
                )}
              </button>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_AI_SETTINGS' })}
                className="w-full flex items-center gap-2.5 text-sm text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 py-2.5 px-4 rounded-xl transition-all"
              >
                <Settings2 size={16} />
                <span>AI Provider</span>
                {state.providerStatus && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    state.providerStatus.activeProvider === 'openrouter'
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {state.providerStatus.activeProvider === 'openrouter' ? 'OpenRouter' : 'Gemini'}
                  </span>
                )}
              </button>
              <div className="text-xs text-gray-700 text-center pt-1">
                {state.providerStatus
                  ? `Set via AI_PROVIDER in .env`
                  : 'Connecting...'}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {state.sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => dispatch({ type: 'SET_SIDEBAR', payload: false })}
        />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#080c14]">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-300 truncate">
              {state.currentConversationId
                ? state.conversations.find((c) => c._id === state.currentConversationId)?.title || 'Conversation'
                : 'New Conversation'}
            </h1>
            <p className="text-xs text-gray-600">Healthcare AI Assistant</p>
          </div>
          {state.medicalContext && (
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-xs text-emerald-400">
              <BrainCircuit size={12} />
              Context Active
            </div>
          )}
          <div
            onClick={() => dispatch({ type: 'TOGGLE_AI_SETTINGS' })}
            title="View AI Provider (set in backend/.env)"
            className={`cursor-pointer flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all hover:scale-105 ${
              state.providerStatus?.activeProvider === 'openrouter'
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 hover:bg-violet-500/20'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            <Settings2 size={11} />
            {state.providerStatus?.activeProvider === 'openrouter' ? 'OpenRouter' : 'Gemini'}
          </div>
        </div>

        {/* Chat area */}
        <ChatWindow messages={state.messages} isLoading={state.isLoading} onSuggestionClick={handleSend} />

        {/* Input area */}
        <InputArea onSend={handleSend} isLoading={state.isLoading} />
      </div>

      {/* ── Context Modal ── */}
      <ContextModal />

      {/* ── AI Settings Modal ── */}
      <AISettingsModal />
    </div>
  );
}
