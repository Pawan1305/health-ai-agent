import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InputArea({ onSend, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="border-t border-white/5 bg-[#080c14] px-4 md:px-8 py-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className={`glass-card rounded-2xl flex items-end gap-3 p-3 transition-all duration-300 ${
            canSend ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/10' : 'border-white/10'
          }`}
          animate={{ borderColor: canSend ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.1)' }}
        >
          {/* Attachment icon (decorative) */}
          <button
            disabled
            title="Attachments coming soon"
            className="flex-shrink-0 mb-0.5 text-gray-700 cursor-not-allowed p-1.5 rounded-lg"
          >
            <Paperclip size={18} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your issue and get a filtered response from multiple AIs..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-40 disabled:opacity-50"
          />

          {/* Mic icon (decorative) */}
          <button
            disabled
            title="Voice input coming soon"
            className="flex-shrink-0 mb-0.5 text-gray-700 cursor-not-allowed p-1.5 rounded-lg"
          >
            <Mic size={18} />
          </button>

          {/* Send button */}
          <motion.button
            onClick={handleSend}
            disabled={!canSend}
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              canSend
                ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/30 cursor-pointer'
                : 'bg-gray-800 cursor-not-allowed opacity-40'
            }`}
          >
            {isLoading
              ? <Loader2 size={16} className="text-white animate-spin" />
              : <Send size={16} className="text-white" />
            }
          </motion.button>
        </motion.div>

        <p className="text-center text-[11px] text-gray-700 mt-2">
          Press <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to send ·{' '}
          <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">Shift+Enter</kbd> for new line ·
          Always consult a healthcare professional
        </p>
      </div>
    </div>
  );
}
