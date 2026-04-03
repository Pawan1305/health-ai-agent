import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, MessageCircle, Heart, Stethoscope, BrainCircuit } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

const suggestions = [
  { icon: Heart, text: 'What are the symptoms of high blood pressure?', color: 'text-rose-400' },
  { icon: Stethoscope, text: 'How can I improve my sleep quality?', color: 'text-cyan-400' },
  { icon: Activity, text: 'What does a complete blood count test measure?', color: 'text-indigo-400' },
  { icon: BrainCircuit, text: 'Explain the difference between Type 1 and Type 2 diabetes', color: 'text-emerald-400' },
];

function WelcomeScreen({ onSuggestionClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center"
    >
      {/* Logo pulse */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center mb-6"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Activity size={24} className="text-white" />
        </div>
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Hi, I'm <span className="gradient-text">MediMind AI</span>
      </h2>
      <p className="text-gray-400 max-w-md mb-10 text-base leading-relaxed">
        Your intelligent healthcare companion. Ask me anything about symptoms, conditions,
        medications, or general wellness. I'm here to help.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              onClick={() => onSuggestionClick(s.text)}
              className="glass-card glow-border rounded-xl p-4 text-left flex items-start gap-3 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300 group"
            >
              <Icon size={18} className={`${s.color} flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`} />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">
                {s.text}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-gray-700 mt-8 max-w-sm">
        ⚠️ For educational purposes only. Always consult a qualified healthcare professional for medical advice.
      </p>
    </motion.div>
  );
}

export default function ChatWindow({ messages, isLoading, onSuggestionClick }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showWelcome = messages.length === 0;
  const showTyping = isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming;

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-3xl mx-auto h-full">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <div className="h-full flex items-center" key="welcome">
              <WelcomeScreen onSuggestionClick={onSuggestionClick} />
            </div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2 pb-4"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <MessageBubble
                    key={idx}
                    message={msg}
                    isStreaming={msg.isStreaming}
                  />
                ))}
              </AnimatePresence>

              {showTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
