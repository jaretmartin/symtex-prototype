/**
 * Toast Component
 *
 * Displays notification messages to the user
 */

import { useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import clsx from 'clsx';
import { useUIStore, type Toast as ToastType } from '@/store';

interface ToastItemProps extends ToastType {
  onDismiss: () => void;
}

const variantStyles = {
  default: {
    container: 'bg-symtex-card border-symtex-border',
    icon: null,
    iconClass: 'text-slate-400',
  },
  success: {
    container: 'bg-success/10 border-success/30',
    icon: CheckCircle,
    iconClass: 'text-success',
  },
  error: {
    container: 'bg-error/10 border-error/30',
    icon: AlertCircle,
    iconClass: 'text-error',
  },
  warning: {
    container: 'bg-warning/10 border-warning/30',
    icon: AlertTriangle,
    iconClass: 'text-warning',
  },
  info: {
    container: 'bg-info/10 border-info/30',
    icon: Info,
    iconClass: 'text-info',
  },
};

function ToastItem({ title, description, variant, onDismiss }: ToastItemProps): JSX.Element {
  const [isExiting, setIsExiting] = useState(false);
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  const handleDismiss = (): void => {
    setIsExiting(true);
    setTimeout(onDismiss, 200);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        'relative flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm',
        'transition-all duration-200',
        styles.container,
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className={clsx('flex-shrink-0 mt-0.5', styles.iconClass)}>
          <Icon className="w-5 h-5" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer(): JSX.Element {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div
      className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 max-w-sm w-full"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          {...toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
