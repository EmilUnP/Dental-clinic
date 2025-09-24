import { useState, useCallback } from 'react';
import { ToastProps } from '../components/ui/Toast';

interface ToastOptions {
  title?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      id,
      message,
      title: options.title,
      type: options.type || 'info',
      duration: options.duration || 5000,
      onClose: removeToast,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message: string, title?: string) => {
    addToast(message, { title, type: 'success' });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast(message, { title, type: 'error' });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast(message, { title, type: 'warning' });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast(message, { title, type: 'info' });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll,
  };
}
