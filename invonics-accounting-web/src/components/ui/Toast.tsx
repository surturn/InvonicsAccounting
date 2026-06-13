import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        warning: (msg) => addToast(msg, 'warning'),
        info: (msg) => addToast(msg, 'info'),
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border animate-slide-in-right max-w-sm w-full bg-bg-elevated",
              toast.variant === 'success' ? 'border-accent' : '',
              toast.variant === 'error' ? 'border-danger' : '',
              toast.variant === 'warning' ? 'border-warning' : '',
              toast.variant === 'info' ? 'border-blue-500' : ''
            )}
          >
            {toast.variant === 'success' && <CheckCircle className="text-accent w-5 h-5 flex-shrink-0" />}
            {toast.variant === 'error' && <AlertCircle className="text-danger w-5 h-5 flex-shrink-0" />}
            {toast.variant === 'warning' && <AlertTriangle className="text-warning w-5 h-5 flex-shrink-0" />}
            {toast.variant === 'info' && <Info className="text-blue-500 w-5 h-5 flex-shrink-0" />}
            
            <p className="text-sm font-medium text-text-primary flex-1">{toast.message}</p>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-text-secondary hover:text-text-primary focus:outline-none flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
