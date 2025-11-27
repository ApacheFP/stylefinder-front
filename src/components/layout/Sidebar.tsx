import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MessageSquare, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
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

  // Sort chat history by most recent first
  const sortedChatHistory = useMemo(() => {
    return [...chatHistory].sort((a, b) => {
      const dateA = new Date(a.lastMessage).getTime();
      const dateB = new Date(b.lastMessage).getTime();
      return dateB - dateA; // Most recent first
    });
  }, [chatHistory]);

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
              aria-hidden="true"
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
          className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-700 flex flex-col h-screen z-50"
          role="navigation"
          aria-label="Chat history sidebar"
        >
          {/* Close button - only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-text-dark dark:text-gray-200" />
          </button>
          {/* New Chat Button */}
          <div className="p-4">
            <motion.button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-border dark:border-gray-600 rounded-lg transition-all duration-200 text-sm font-inter font-medium text-text-dark dark:text-white shadow-sm hover:shadow-md"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Start new chat"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </motion.button>
          </div>

          {/* History Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h3 className="text-xs font-roboto font-bold text-text-medium dark:text-gray-300 uppercase tracking-wide mb-3">
                HISTORY
              </h3>
              <motion.div
                className="space-y-1"
                variants={staggerContainer}
                animate="visible"
              >
                {sortedChatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
                      <MessageSquare className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm font-inter text-text-light dark:text-gray-400 mb-1">
                      No conversations yet
                    </p>
                    <p className="text-xs font-inter text-text-light dark:text-gray-500">
                      Start chatting to see your history here
                    </p>
                  </div>
                ) : (
                  sortedChatHistory.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-all duration-200 ${currentChatId === chat.id
                        ? 'bg-primary/5 text-primary font-medium border border-primary/10'
                        : 'text-text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                        }`}
                      title={chat.title}
                      aria-label={`Open chat: ${chat.title}`}
                      aria-current={currentChatId === chat.id ? 'page' : undefined}
                    >
                      <span className="block truncate">{chat.title}</span>
                    </button>
                  ))
                )}
              </motion.div>
            </div>
          </div>


          {/* Footer - How to Use */}
          <div className="p-4 border-t border-border dark:border-gray-700">
            <Link to="/how-to-use" className="flex items-center gap-3 px-2 py-2 text-text-medium dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">How to use</span>
            </Link>
          </div>
        </motion.aside >
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
        className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white dark:bg-gray-900 border-r border-border dark:border-gray-700 flex flex-col h-screen z-50"
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Close button - only on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-text-dark dark:text-gray-200" />
        </button>
        {/* New Chat Button */}
        <div className="p-4">
          <motion.button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-border dark:border-gray-600 rounded-lg transition-all duration-200 text-sm font-inter font-medium text-text-dark dark:text-white shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Start new chat"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </motion.button>
        </div>

        {/* Centered content container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full px-6">
            {/* Chat History Title - centered */}
            <h3 className="text-lg font-roboto font-bold text-text-dark dark:text-gray-100 text-center mb-4">
              Chat History
            </h3>

            {/* Auth Note - directly under Chat History */}
            <p className="text-center text-xs font-inter text-text-medium dark:text-gray-300 leading-relaxed mb-4">
              Log in or sign up to save your conversations.
            </p>
          </div>
        </div>

        {/* Footer - How to Use */}
        <div className="p-4 border-t border-border dark:border-gray-700">
          <Link to="/how-to-use" className="flex items-center gap-3 px-2 py-2 text-text-medium dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">How to use</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
