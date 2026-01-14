/**
 * StreamingText Component
 *
 * Displays streaming AI responses with typing animation effects.
 * Shows a typing indicator while waiting, then reveals text gradually.
 */

import { useState, useEffect, useRef } from 'react';

interface StreamingTextProps {
  /** The text to display (may be partial while streaming) */
  text: string;
  /** Whether the response is still streaming */
  isStreaming: boolean;
  /** Speed of text reveal in milliseconds per character */
  speed?: number;
  /** Callback when streaming animation completes */
  onComplete?: () => void;
}

/**
 * Typing indicator with animated dots
 */
function TypingIndicator(): JSX.Element {
  return (
    <div className="flex items-center gap-1.5 py-2">
      <span
        className="w-2 h-2 bg-symtex-primary rounded-full animate-bounce"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="w-2 h-2 bg-symtex-primary rounded-full animate-bounce"
        style={{ animationDelay: '150ms' }}
      />
      <span
        className="w-2 h-2 bg-symtex-primary rounded-full animate-bounce"
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}

/**
 * Blinking cursor for the end of streaming text
 */
function BlinkingCursor(): JSX.Element {
  return (
    <span className="inline-block w-0.5 h-4 bg-symtex-primary animate-pulse ml-0.5 align-middle" />
  );
}

/**
 * Displays text with streaming/typing animation effect
 */
export function StreamingText({
  text,
  isStreaming,
  speed = 15,
  onComplete,
}: StreamingTextProps): JSX.Element {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTextRef = useRef('');

  // Handle text streaming animation
  useEffect(() => {
    // If text is shorter than what we've displayed (reset), start over
    if (text.length < displayedText.length) {
      setDisplayedText('');
      lastTextRef.current = '';
      return;
    }

    // If new text is longer, animate the new characters
    if (text.length > displayedText.length) {
      const newChars = text.slice(displayedText.length);
      let charIndex = 0;

      const intervalId = setInterval(() => {
        if (charIndex < newChars.length) {
          setDisplayedText((prev) => prev + newChars[charIndex]);
          charIndex++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }

    // Text is fully displayed
    if (text.length === displayedText.length && !isStreaming) {
      setShowCursor(false);
      onComplete?.();
    }
  }, [text, displayedText.length, isStreaming, speed, onComplete]);

  // Auto-scroll as text appears
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayedText]);

  // Reset cursor visibility when streaming starts
  useEffect(() => {
    if (isStreaming) {
      setShowCursor(true);
    }
  }, [isStreaming]);

  // Show typing indicator when streaming but no text yet
  if (isStreaming && text.length === 0) {
    return <TypingIndicator />;
  }

  return (
    <div ref={containerRef} className="text-sm text-slate-200 whitespace-pre-wrap break-words">
      {displayedText}
      {isStreaming && showCursor && <BlinkingCursor />}
    </div>
  );
}

/**
 * Hook to manage streaming text state
 */
export function useStreamingText(initialText = ''): {
  text: string;
  isStreaming: boolean;
  startStreaming: () => void;
  appendText: (chunk: string) => void;
  stopStreaming: () => void;
  reset: () => void;
} {
  const [text, setText] = useState(initialText);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = (): void => {
    setText('');
    setIsStreaming(true);
  };

  const appendText = (chunk: string): void => {
    setText((prev) => prev + chunk);
  };

  const stopStreaming = (): void => {
    setIsStreaming(false);
  };

  const reset = (): void => {
    setText('');
    setIsStreaming(false);
  };

  return {
    text,
    isStreaming,
    startStreaming,
    appendText,
    stopStreaming,
    reset,
  };
}
