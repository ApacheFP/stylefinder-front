import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { ChatHistory } from '../../types';
import { staggerContainer } from '../../utils/animations';

interface SidebarProps {
  chatHistory: ChatHistory[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({
  chatHistory,
  currentChatId,
  onSelectChat,
  onNewChat,
  isOpen = true,
  onClose
}: SidebarProps) => {

  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Logged in view
    return (
      <>
        {/* Mobile Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: isOpen ? 0 : -280,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-800 flex flex-col h-screen z-50"
        >
          {/* Close button - only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-text-dark" />
          </button>
          {/* New Chat Button */}
          <div className="p-4">
            <motion.button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-border dark:border-gray-700 rounded-lg transition-all duration-200 text-sm font-inter font-medium text-text-dark dark:text-white shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              New Chat
            </motion.button>
          </div>

          {/* History Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h3 className="text-xs font-roboto font-bold text-text-medium uppercase tracking-wide mb-3">
                HISTORY
              </h3>
              <motion.div
                className="space-y-1"
                variants={staggerContainer}
                animate="visible"
              >
                {chatHistory.length === 0 ? (
                  <p className="text-sm font-inter text-text-light text-center py-4">
                    No chat history yet
                  </p>
                ) : (
                  chatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-all duration-200 ${currentChatId === chat.id
                        ? 'bg-primary/5 text-primary font-medium border border-primary/10'
                        : 'text-text-dark dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                        }`}
                    >
                      {chat.title}
                    </button>
                  ))
                )}
              </motion.div>
            </div>
          </div>
        </motion.aside>
      </>
    );
  }

  // Logged out view
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-800 flex flex-col h-screen z-50"
      >
        {/* Close button - only on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-text-dark" />
        </button>
        {/* Centered content container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full px-6">
            {/* Chat History Title - centered */}
            <h3 className="text-lg font-roboto font-bold text-text-dark dark:text-white text-center mb-4">
              Chat History
            </h3>

            {/* Auth Note - directly under Chat History */}
            <p className="text-center text-xs font-inter text-text-medium dark:text-gray-400 leading-relaxed mb-4">
              Log in or sign up to save your conversations.
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
