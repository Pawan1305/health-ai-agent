import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25 }}
      className="flex gap-3 mb-5"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
        <Bot size={15} className="text-white" />
      </div>
      <div className="flex flex-col gap-1 items-start">
        <span className="text-[11px] font-semibold text-cyan-400">MediMind AI</span>
        <div className="bg-[#0d1932] border border-cyan-500/15 rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="typing-dot w-2 h-2 rounded-full bg-cyan-400"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
