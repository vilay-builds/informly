"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easing } from "@/lib/motion";

interface ToastMessage {
  id: string;
  message: string;
  variant?: "default" | "success" | "danger" | "info";
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextValue {
  show: (toast: Omit<ToastMessage, "id">) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (t: Omit<ToastMessage, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const toast = { id, duration: 3200, ...t };
      setToasts((curr) => [...curr, toast]);
      if (toast.duration) {
        setTimeout(() => dismiss(id), toast.duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      <div
        className="fixed bottom-24 lg:bottom-6 inset-x-0 z-[100] pointer-events-none flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={easing.spring}
              className="pointer-events-auto max-w-md w-full bg-text-primary text-white rounded-full shadow-xl px-4 py-3 flex items-center gap-3"
            >
              <ToastIcon variant={t.variant} />
              <span className="text-sm font-medium flex-1">{t.message}</span>
              {t.action && (
                <button
                  onClick={() => {
                    t.action!.onClick();
                    dismiss(t.id);
                  }}
                  className="text-xs font-semibold text-primary-300 hover:text-white"
                >
                  {t.action.label}
                </button>
              )}
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-white/40 hover:text-white"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastIcon({ variant }: { variant?: ToastMessage["variant"] }) {
  if (variant === "success") {
    return (
      <div className="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center flex-shrink-0">
        <svg width="12" height="12" fill="white" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </div>
    );
  }
  if (variant === "danger") {
    return (
      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  if (variant === "info") {
    return (
      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
        <svg width="11" height="11" fill="white" viewBox="0 0 24 24">
          <path d="M12 4a1 1 0 100 2 1 1 0 000-2zM11 9a1 1 0 011-1h0a1 1 0 011 1v8a1 1 0 11-2 0V9z" />
        </svg>
      </div>
    );
  }
  return null;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Safe no-op when used outside provider
    return {
      show: () => "",
      dismiss: () => {},
    } as ToastContextValue;
  }
  return ctx;
}
