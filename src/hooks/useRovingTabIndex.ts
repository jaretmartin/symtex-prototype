import { useState, useCallback, KeyboardEvent } from 'react';

export function useRovingTabIndex(itemCount: number) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % itemCount);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + itemCount) % itemCount);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(itemCount - 1);
        break;
    }
  }, [itemCount]);

  const getTabIndex = useCallback((index: number) =>
    index === focusedIndex ? 0 : -1
  , [focusedIndex]);

  return { focusedIndex, handleKeyDown, getTabIndex, setFocusedIndex };
}
