import { useEffect } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description?: string;
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const metaMatches = shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey;
        const shiftMatches = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;

        if (keyMatches && ctrlMatches && metaMatches && shiftMatches) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};

// Hook for handling Enter key in input with Cmd/Ctrl modifier for new line
export const useEnterSubmit = (
  onSubmit: () => void,
  multiline = false
) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      // If Cmd/Ctrl+Enter and multiline is enabled, allow new line
      if ((event.metaKey || event.ctrlKey) && multiline) {
        return; // Let default behavior add new line
      }

      // If just Enter without modifiers, submit
      if (!event.metaKey && !event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        onSubmit();
      }
    }
  };

  return { handleKeyDown };
};
