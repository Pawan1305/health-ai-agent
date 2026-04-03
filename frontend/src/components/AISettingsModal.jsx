import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Settings2, CheckCircle, XCircle, ExternalLink, Zap, Terminal, RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { fetchProviderStatus } from '../services/api.js';

const MODEL_LABELS = {
  'meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B (Meta)',
  'deepseek/deepseek-r1:free': 'DeepSeek R1',
  'google/gemma-3-27b-it:free': 'Gemma 3 27B (Google)',
  'mistralai/mistral-7b-instruct:free': 'Mistral 7B (Mistral AI)',
  'qwen/qwen-2.5-7b-instruct:free': 'Qwen 2.5 7B (Alibaba)',
  'gemini-2.0-flash': 'Gemini 2.0 Flash (Google)',
};

export default function AISettingsModal() {
  const { state, dispatch } = useApp();
  const open = state.aiSettingsOpen;
  const status = state.providerStatus;

  const refresh = () => {
    fetchProviderStatus()
      .then((s) => dispatch({ type: 'SET_PROVIDER_STATUS', payload: s }))
      .catch(console.error);
  };

  const activeProvider = status?.activeProvider;
  const activeModel = status?.activeModel;
  const geminiOk = status?.gemini?.configured;
  const openrouterOk = status?.openrouter?.configured;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => dispatch({ type: 'SET_AI_SETTINGS', payload: false })}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-[#0a1628] border border-indigo-500/20 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center">
                    <Settings2 size={18} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">AI Provider</h3>
                    <p className="text-xs text-gray-500">
                      Configured via <code className="bg-white/5 px-1 rounded">backend/.env</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refresh}
                    title="Refresh status from backend"
                    className="text-gray-600 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  >
                    <RefreshCw size={15} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'SET_AI_SETTINGS', payload: false })}
                    className="text-gray-600 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Active provider banner */}
                {status ? (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                    activeProvider === 'openrouter'
                      ? 'bg-violet-500/10 border-violet-500/30'
                      : 'bg-cyan-500/10 border-cyan-500/30'
                  }`}>
                    <Zap size={18} className={activeProvider === 'openrouter' ? 'text-violet-400' : 'text-cyan-400'} />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {activeProvider === 'openrouter' ? 'OpenRouter' : 'Google Gemini'} is active
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Model: <span className="text-gray-300">{MODEL_LABELS[activeModel] || activeModel}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/3 text-gray-500 text-sm">
                    <RefreshCw size={16} className="animate-spin" /> Fetching status from backend...
                  </div>
                )}

                {/* Provider key status */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">API Key Status</p>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                      activeProvider === 'gemini' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/8 bg-white/2'
                    }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${geminiOk ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                        {geminiOk ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-rose-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">Google Gemini</p>
                        <p className="text-[11px] text-gray-500">{geminiOk ? 'GEMINI_API_KEY is set ✓' : 'GEMINI_API_KEY missing'}</p>
                      </div>
                      {activeProvider === 'gemini' && (
                        <span className="text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 px-1.5 py-0.5 rounded-md font-semibold">ACTIVE</span>
                      )}
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                      activeProvider === 'openrouter' ? 'border-violet-500/30 bg-violet-500/5' : 'border-white/8 bg-white/2'
                    }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${openrouterOk ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                        {openrouterOk ? <CheckCircle size={14} className="text-emerald-400" /> : <XCircle size={14} className="text-rose-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">OpenRouter</p>
                        <p className="text-[11px] text-gray-500">{openrouterOk ? 'OPENROUTER_API_KEY is set ✓' : 'OPENROUTER_API_KEY missing'}</p>
                      </div>
                      {activeProvider === 'openrouter' && (
                        <span className="text-[10px] bg-violet-500/15 text-violet-400 border border-violet-500/25 px-1.5 py-0.5 rounded-md font-semibold">ACTIVE</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* How to change */}
                <div className="bg-[#060d1a] border border-white/8 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                    <Terminal size={13} /> How to switch providers
                  </p>
                  <p className="text-xs text-gray-500">Edit <code className="bg-white/8 text-gray-300 px-1.5 py-0.5 rounded">backend/.env</code> and set:</p>
                  <div className="bg-[#030810] border border-white/5 rounded-lg p-3 font-mono text-xs space-y-1">
                    <div><span className="text-gray-600"># Gemini:</span></div>
                    <div><span className="text-emerald-400">AI_PROVIDER</span><span className="text-gray-400">=</span><span className="text-amber-300">gemini</span></div>
                    <div className="mt-2"><span className="text-gray-600"># OpenRouter:</span></div>
                    <div><span className="text-emerald-400">AI_PROVIDER</span><span className="text-gray-400">=</span><span className="text-amber-300">openrouter</span></div>
                    <div><span className="text-emerald-400">OPENROUTER_MODEL</span><span className="text-gray-400">=</span><span className="text-amber-300">meta-llama/llama-3.1-8b-instruct:free</span></div>
                  </div>
                  <p className="text-[11px] text-gray-600">Restart the backend after editing — no frontend change needed.</p>
                </div>

                {/* Get keys */}
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 bg-white/3 hover:bg-cyan-500/10 border border-white/8 hover:border-cyan-500/30 px-3 py-2 rounded-xl transition-all">
                    <ExternalLink size={12} /> Get Gemini Key
                  </a>
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-violet-400 bg-white/3 hover:bg-violet-500/10 border border-white/8 hover:border-violet-500/30 px-3 py-2 rounded-xl transition-all">
                    <ExternalLink size={12} /> Get OpenRouter Key
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-5 border-t border-white/5">
                <button
                  onClick={() => dispatch({ type: 'SET_AI_SETTINGS', payload: false })}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
                >
                  <CheckCircle size={15} /> Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
