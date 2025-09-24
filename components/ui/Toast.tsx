import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './button';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
  },
};

export default function Toast({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-hide toast
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out',
        config.bgColor,
        config.borderColor,
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={cn('text-sm font-medium', config.textColor)}>
                {title}
              </p>
            )}
            <p className={cn('text-sm', config.textColor, title && 'mt-1')}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className={cn('h-5 w-5 p-0', config.textColor, 'hover:bg-transparent')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
}
