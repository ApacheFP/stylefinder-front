import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import type { ChatHistory } from '../../types';
import { staggerContainer, staggerItem } from '../../utils/animations';

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
  // Check if user is logged in (simplified check - in real app use AuthContext)
  // Toggle this between true/false to test logged in/out states
  const isLoggedIn = true; // TODO: Replace with actual auth check from useAuth()

  if (isLoggedIn) {
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
          className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white border-r border-border flex flex-col h-screen z-50"
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-border rounded-lg transition-all duration-200 text-sm font-inter font-medium text-text-dark"
            whileHover={{ scale: 1.02, backgroundColor: '#F9FAFB' }}
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
              initial="hidden"
              animate="visible"
            >
              {chatHistory.length === 0 ? (
                <p className="text-sm font-inter text-text-light text-center py-4">
                  No chat history yet
                </p>
              ) : (
                chatHistory.map((chat) => (
                  <motion.button
                    key={chat.id}
                    variants={staggerItem}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-gray-100 text-text-dark font-medium'
                        : 'text-text-dark hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 4, backgroundColor: '#F9FAFB' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {chat.title}
                  </motion.button>
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
        className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-white border-r border-border flex flex-col h-screen z-50"
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
          <h3 className="text-lg font-roboto font-bold text-text-dark text-center mb-4">
            Chat History
          </h3>
          
          {/* Auth Note - directly under Chat History */}
          <p className="text-center text-xs font-inter text-text-medium leading-relaxed mb-4">
            Log in or sign up to save your conversations.
          </p>
        </div>
      </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
