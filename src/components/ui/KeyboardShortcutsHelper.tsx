import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['⌘', 'K'], description: 'New chat' },
  { keys: ['⌘', 'I'], description: 'Focus input' },
  { keys: ['Enter'], description: 'Send message' },
  { keys: ['Shift', 'Enter'], description: 'New line' },
  { keys: ['?'], description: 'Show shortcuts' },
];

// Windows/Linux shortcuts
const SHORTCUTS_WIN: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'New chat' },
  { keys: ['Ctrl', 'I'], description: 'Focus input' },
  { keys: ['Enter'], description: 'Send message' },
  { keys: ['Shift', 'Enter'], description: 'New line' },
  { keys: ['?'], description: 'Show shortcuts' },
];

const KeyboardShortcutsHelper = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // Detect OS
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);

    // Listen for '?' key to toggle shortcuts panel
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const shortcuts = isMac ? SHORTCUTS : SHORTCUTS_WIN;

  return (
    <>
      {/* Floating button to show shortcuts */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl transition-shadow group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-light transition-colors" />
      </motion.button>

      {/* Shortcuts panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-24 right-4 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-primary dark:text-primary-light" />
                  <h3 className="font-roboto font-bold text-gray-900 dark:text-white">
                    Keyboard Shortcuts
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-gray-400 mx-0.5">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                  Press <kbd className="px-1.5 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-700 rounded">?</kbd> to toggle this panel
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcutsHelper;
