import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BrainCircuit, Save, RotateCcw, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const TEMPLATE = `Age: 
Gender: 
Blood Type: 

Existing Conditions:
- 

Current Medications:
- (name, dose, frequency)

Allergies:
- 

Recent Symptoms / Concerns:
- 

Last Physical Exam: 
BMI / Weight: `;

export default function ContextModal() {
  const { state, dispatch } = useApp();
  const [draft, setDraft] = useState(state.medicalContext);
  const [saved, setSaved] = useState(false);

  const open = state.contextModalOpen;

  const handleOpen = () => {
    setDraft(state.medicalContext);
    setSaved(false);
  };

  const handleSave = () => {
    dispatch({ type: 'SET_CONTEXT', payload: draft });
    setSaved(true);
    setTimeout(() => {
      dispatch({ type: 'SET_CONTEXT_MODAL', payload: false });
      setSaved(false);
    }, 1200);
  };

  const handleClear = () => {
    setDraft('');
  };

  const handleLoadTemplate = () => {
    setDraft(TEMPLATE);
  };

  const charCount = draft.length;
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;

  return (
    <AnimatePresence onExitComplete={handleOpen}>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => dispatch({ type: 'SET_CONTEXT_MODAL', payload: false })}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-[#0a1628] border border-cyan-500/20 rounded-2xl w-full max-w-xl shadow-2xl shadow-black/50 pointer-events-auto flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <BrainCircuit size={18} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Medical Context</h3>
                    <p className="text-xs text-gray-500">Personalize AI responses with your health profile</p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_CONTEXT_MODAL', payload: false })}
                  className="text-gray-600 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Info bar */}
              <div className="mx-5 mt-4 mb-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-xs text-cyan-300">
                <strong>How it works:</strong> This context is sent with every message so the AI can give you
                personalized health information. It's stored only in your browser.
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 px-5 py-2">
                <button
                  onClick={handleLoadTemplate}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  <FileText size={13} /> Load Template
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 px-3 py-1.5 rounded-lg transition-all"
                >
                  <RotateCcw size={13} /> Clear
                </button>
                <div className="ml-auto text-xs text-gray-600">
                  {wordCount} words · {charCount}/5000
                </div>
              </div>

              {/* Textarea */}
              <div className="px-5 pb-2 flex-1 overflow-hidden">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, 5000))}
                  placeholder="Enter your medical information here (age, conditions, medications, allergies...)
Or click 'Load Template' to get started."
                  className="w-full h-64 bg-[#060d1a] border border-white/10 focus:border-cyan-500/40 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-700 resize-none focus:outline-none transition-colors leading-relaxed font-mono"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-5 border-t border-white/5 gap-3">
                <button
                  onClick={() => dispatch({ type: 'SET_CONTEXT_MODAL', payload: false })}
                  className="text-sm text-gray-500 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 ${
                    saved
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                      : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                  }`}
                >
                  {saved ? (
                    <><CheckCircle size={16} /> Saved!</>
                  ) : (
                    <><Save size={16} /> Save Context</>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
