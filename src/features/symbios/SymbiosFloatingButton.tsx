/**
 * SymbiosFloatingButton Component
 *
 * Persistent floating button for quick access to Symbios chat.
 * Features pulsing animation when active and unread badge.
 */

import { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SymbiosFloatingButtonProps {
  isOpen: boolean;
  unreadCount?: number;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function SymbiosFloatingButton({
  isOpen,
  unreadCount = 0,
  isActive = false,
  onClick,
  className,
  position = 'bottom-right',
}: SymbiosFloatingButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip on first load if there are unread messages
  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      setShowTooltip(true);
      const timer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, isOpen]);

  return (
    <div
      className={cn(
        'fixed z-50',
        position === 'bottom-right' ? 'bottom-6 right-6' : 'bottom-6 left-6',
        className
      )}
    >
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div
          className={cn(
            'absolute bottom-full mb-2 px-3 py-2 rounded-lg',
            'bg-card border border-border shadow-lg',
            'text-sm text-foreground whitespace-nowrap',
            'animate-fade-in-up',
            position === 'bottom-right' ? 'right-0' : 'left-0'
          )}
        >
          <span>You have {unreadCount} new message{unreadCount !== 1 ? 's' : ''}</span>
          {/* Arrow */}
          <div
            className={cn(
              'absolute -bottom-1.5 w-3 h-3 bg-card border-b border-r border-border rotate-45',
              position === 'bottom-right' ? 'right-5' : 'left-5'
            )}
          />
        </div>
      )}

      {/* Main button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative flex items-center justify-center',
          'w-14 h-14 rounded-2xl shadow-lg',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900',
          isOpen
            ? 'bg-card hover:bg-muted rotate-0'
            : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500',
          isActive && !isOpen && 'animate-pulse-subtle',
          isHovered && !isOpen && 'scale-110'
        )}
        aria-label={isOpen ? 'Close Symbios' : 'Open Symbios'}
      >
        {/* Pulsing ring effect */}
        {isActive && !isOpen && (
          <>
            <span className="absolute inset-0 rounded-2xl bg-indigo-500 animate-ping opacity-20" />
            <span className="absolute inset-0 rounded-2xl bg-indigo-500 animate-ping opacity-10 animation-delay-500" />
          </>
        )}

        {/* Icon */}
        <span
          className={cn(
            'transition-transform duration-300',
            isOpen ? 'rotate-0' : 'rotate-0'
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-foreground" />
          ) : (
            <Sparkles className="w-6 h-6 text-foreground" />
          )}
        </span>

        {/* Unread badge */}
        {unreadCount > 0 && !isOpen && (
          <span
            className={cn(
              'absolute -top-1 -right-1',
              'flex items-center justify-center',
              'min-w-[20px] h-5 px-1.5 rounded-full',
              'bg-red-500 text-foreground text-xs font-bold',
              'shadow-lg animate-scale-in'
            )}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Keyboard shortcut hint */}
      {isHovered && !isOpen && (
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 px-2 py-1 rounded',
            'bg-card/90 border border-border',
            'text-xs text-muted-foreground whitespace-nowrap',
            'animate-fade-in',
            position === 'bottom-right' ? 'right-full mr-3' : 'left-full ml-3'
          )}
        >
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Cmd</kbd>
          {' + '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">K</kbd>
        </div>
      )}
    </div>
  );
}

/**
 * SymbiosMinimizedBar - Minimized bar version of the floating button
 */
interface SymbiosMinimizedBarProps {
  cognateName?: string;
  status?: 'online' | 'busy' | 'away' | 'offline';
  unreadCount?: number;
  onClick: () => void;
  onClose: () => void;
  className?: string;
}

export function SymbiosMinimizedBar({
  cognateName = 'Aria',
  status = 'online',
  unreadCount = 0,
  onClick,
  onClose,
  className,
}: SymbiosMinimizedBarProps): JSX.Element {
  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    away: 'bg-muted',
    offline: 'bg-muted',
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center gap-3 px-4 py-3 rounded-xl',
        'bg-card border border-border shadow-xl',
        'animate-slide-in-right',
        className
      )}
    >
      {/* Avatar with status */}
      <button
        onClick={onClick}
        className="relative flex-shrink-0"
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-foreground" />
        </div>
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-border',
            statusColors[status]
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-foreground text-xs font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Info */}
      <button
        onClick={onClick}
        className="flex flex-col items-start min-w-0"
      >
        <span className="text-sm font-medium text-foreground">{cognateName}</span>
        <span className="text-xs text-muted-foreground capitalize">{status}</span>
      </button>

      {/* Actions */}
      <div className="flex items-center gap-1 ml-2">
        <button
          onClick={onClick}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Open chat"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default SymbiosFloatingButton;
