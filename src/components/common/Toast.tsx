import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, description?: string) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message, description }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((msg: string, desc?: string) => addToast(msg, 'success', desc), [addToast]);
  const error = useCallback((msg: string, desc?: string) => addToast(msg, 'error', desc), [addToast]);
  const info = useCallback((msg: string, desc?: string) => addToast(msg, 'info', desc), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium',
                t.type === 'success' && 'bg-emerald-950/90 border-emerald-800/80 text-emerald-200',
                t.type === 'error' && 'bg-rose-950/90 border-rose-800/80 text-rose-200',
                t.type === 'info' && 'bg-slate-900/90 border-slate-700/80 text-slate-200'
              )}
            >
              <span className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-white">{t.message}</p>
                {t.description && <p className="text-xs mt-0.5 opacity-90">{t.description}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-gray-400 hover:text-white shrink-0 p-1"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
