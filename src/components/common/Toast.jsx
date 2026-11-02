import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export default function ToastContainer() {
  const { toasts, dismissToast } = useBanking();

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
    info: <Info size={18} className="text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30',
    error: 'border-rose-500/30',
    warning: 'border-amber-500/30',
    info: 'border-cyan-500/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-xl border ${
              borders[toast.type] || borders.info
            } shadow-2xl text-slate-100`}
          >
            <div className="mt-0.5">{icons[toast.type] || icons.info}</div>
            <div className="flex-1 min-w-0">
              <h5 className="font-semibold text-sm leading-tight text-white">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
