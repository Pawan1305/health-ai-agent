import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, User, Bot } from 'lucide-react';

function formatTime(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

const markdownComponents = {
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  table: ({ children }) => <table>{children}</table>,
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  hr: () => <hr />,
  // eslint-disable-next-line no-unused-vars
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return <code {...props}>{children}</code>;
    }
    return (
      <pre>
        <code className={className} {...props}>{children}</code>
      </pre>
    );
  },
};

export default function MessageBubble({ message, isStreaming = false }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 mb-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
            : 'bg-gradient-to-br from-cyan-500 to-teal-600'
        }`}
      >
        {isUser
          ? <User size={15} className="text-white" />
          : <Bot size={15} className="text-white" />
        }
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className={`text-[11px] font-semibold ${isUser ? 'text-blue-400' : 'text-cyan-400'}`}>
          {isUser ? 'You' : 'MediMind AI'}
        </span>

        <div
          className={`relative group rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-sm shadow-lg shadow-blue-900/30'
              : 'bg-[#0d1932] border border-cyan-500/15 text-gray-200 rounded-tl-sm'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          ) : (
            <div className="md-body text-sm leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {message.content}
              </ReactMarkdown>
              {isStreaming && <span className="stream-cursor" />}
            </div>
          )}

          {/* Copy button — AI messages only, not streaming */}
          {!isUser && !isStreaming && message.content && (
            <button
              onClick={copy}
              title="Copy response"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              {copied
                ? <Check size={13} className="text-green-400" />
                : <Copy size={13} />
              }
            </button>
          )}
        </div>

        <span className="text-[10px] text-gray-700">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}
