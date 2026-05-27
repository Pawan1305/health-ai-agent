import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2 } from 'lucide-react';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ConversationItem({ conv, isActive, onSelect, onDelete }) {
  const [hovering, setHovering] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(conv._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(conv._id)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); }}
      className={`relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${
        isActive
          ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 border border-cyan-500/25'
          : 'hover:bg-white/5 border border-transparent'
      }`}
    >
      <MessageSquare
        size={14}
        className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate leading-snug ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
          {conv.title || 'New Conversation'}
        </p>
        <p className="text-[11px] text-gray-700 mt-0.5">{timeAgo(conv.updatedAt || conv.createdAt)}</p>
      </div>

      {/* Delete button */}
      <AnimatePresence>
        {hovering && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={handleDelete}
            title="Delete conversation"
            className="flex-shrink-0 p-1 rounded-md transition-colors text-gray-600 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={13} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ConversationList({ conversations, currentId, onSelect, onDelete }) {
  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <MessageSquare size={18} className="text-gray-600" />
        </div>
        <p className="text-sm text-gray-600">No conversations yet</p>
        <p className="text-xs text-gray-700 mt-1">Start chatting to see history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 pb-4">
      <AnimatePresence>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv._id}
            conv={conv}
            isActive={conv._id === currentId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
