import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, MessageSquare, HelpCircle, Loader2, MoreVertical, Edit2, Trash2, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import type { ChatHistory } from '../../types';
import { staggerContainer } from '../../utils/animations';

interface SidebarProps {
  chatHistory: ChatHistory[];
  currentChatId?: string;
  isNewChat?: boolean;
  isLoadingHistory?: boolean;
  onRenameChat: (chatId: string, newTitle: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void>;
  onNewChat?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({
  chatHistory,
  currentChatId,
  isNewChat = false,
  isLoadingHistory = false,
  onRenameChat,
  onDeleteChat,
  onNewChat,
  isOpen = true,
  onClose
}: SidebarProps) => {

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
        setDeleteConfirmId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when renaming starts
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [renamingId]);

  // Sort chat history by most recent first
  const sortedChatHistory = useMemo(() => {
    return [...chatHistory].sort((a, b) => {
      const dateA = new Date(a.lastMessage).getTime();
      const dateB = new Date(b.lastMessage).getTime();
      return dateB - dateA; // Most recent first
    });
  }, [chatHistory]);

  const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (activeMenuId === chatId) {
      setActiveMenuId(null);
      setDeleteConfirmId(null);
    } else {
      setActiveMenuId(chatId);
      setDeleteConfirmId(null);
    }
  };

  const handleRenameClick = (e: React.MouseEvent, chat: ChatHistory) => {
    e.stopPropagation();
    setRenamingId(chat.id);
    setRenameValue(chat.title);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setDeleteConfirmId(chatId);
  };

  const confirmDelete = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    await onDeleteChat(chatId);
    setDeleteConfirmId(null);
    setActiveMenuId(null);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
    setActiveMenuId(null); // Close menu on cancel? Or just go back? Let's close for now.
  };

  const handleRenameSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renamingId && renameValue.trim()) {
      await onRenameChat(renamingId, renameValue.trim());
      setRenamingId(null);
    }
  };

  const handleRenameCancel = () => {
    setRenamingId(null);
    setRenameValue('');
  };

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
          className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-cream-100 dark:bg-surface-dark border-r border-cream-300 dark:border-surface-muted flex flex-col h-screen z-50"
          role="navigation"
          aria-label="Chat history sidebar"
        >
          {/* Close button - only on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-cream-200 dark:hover:bg-surface-muted rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-text-dark dark:text-stone-200" />
          </button>
          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={() => {
                // Don't do anything if already in new chat
                if (isNewChat) return;
                
                // Use the callback if provided, otherwise just navigate
                if (onNewChat) {
                  onNewChat();
                } else {
                  navigate('/chat');
                }
                // Close sidebar on mobile after creating new chat
                if (window.innerWidth < 1024) {
                  onClose?.();
                }
              }}
              variant="outline"
              disabled={isNewChat}
              className={`w-full justify-center gap-2 ${isNewChat 
                ? 'bg-primary/10 border-primary/30 text-primary cursor-default' 
                : 'bg-cream-100 dark:bg-surface-darker hover:bg-cream-200 dark:hover:bg-surface-muted'}`}
              aria-label="Start new chat"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </Button>
          </div>

          {/* History Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h3 className="text-xs font-roboto font-bold text-text-medium dark:text-stone-400 uppercase tracking-wide mb-3">
                HISTORY
              </h3>
              <motion.div
                className="space-y-1"
                variants={staggerContainer}
                animate="visible"
              >
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin mb-3" />
                    <p className="text-sm font-inter text-text-light dark:text-stone-500">
                      Loading history...
                    </p>
                  </div>
                ) : sortedChatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="p-3 bg-stone-100 dark:bg-surface-muted rounded-full mb-3">
                      <MessageSquare className="w-6 h-6 text-stone-400 dark:text-stone-500" />
                    </div>
                    <p className="text-sm font-inter text-text-light dark:text-stone-500 mb-1">
                      No conversations yet
                    </p>
                    <p className="text-xs font-inter text-text-light dark:text-stone-600">
                      Start chatting to see your history here
                    </p>
                  </div>
                ) : (
                  sortedChatHistory.map((chat) => (
                    <div key={chat.id} className="relative group">
                      {renamingId === chat.id ? (
                        <form onSubmit={handleRenameSubmit} className="flex items-center gap-1 px-2 py-1">
                          <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={handleRenameSubmit}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') handleRenameCancel();
                            }}
                            className="flex-1 min-w-0 text-sm bg-cream-100 dark:bg-surface-darker border border-primary rounded px-2 py-1 outline-none text-text-dark dark:text-stone-200"
                            autoFocus
                          />
                          <button
                            type="submit"
                            className="p-1 hover:bg-cream-200 dark:hover:bg-surface-muted rounded text-green-600"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleRenameCancel}
                            className="p-1 hover:bg-cream-200 dark:hover:bg-surface-muted rounded text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            navigate(`/chat/${chat.id}`);
                            // Close sidebar on mobile after selection
                            if (window.innerWidth < 1024) {
                              onClose?.();
                            }
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-inter transition-all duration-200 flex items-center justify-between group ${currentChatId === chat.id
                            ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-sm'
                            : 'text-text-dark dark:text-stone-200 hover:bg-primary/5 dark:hover:bg-surface-muted hover:border-primary/10 border border-transparent'
                            }`}
                          title={chat.title}
                          aria-label={`Open chat: ${chat.title}`}
                          aria-current={currentChatId === chat.id ? 'page' : undefined}
                        >
                          <span className="block truncate flex-1 pr-2">{chat.title}</span>

                          {/* Kebab Menu Trigger */}
                          <div
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeMenuId === chat.id ? 'opacity-100' : ''}`}
                            onClick={(e) => handleMenuClick(e, chat.id)}
                          >
                            <div className="p-1 hover:bg-stone-200 dark:hover:bg-surface-border rounded-md">
                              <MoreVertical className="w-4 h-4 text-stone-500" />
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Dropdown Menu / Delete Confirmation */}
                      <AnimatePresence>
                        {activeMenuId === chat.id && (
                          <motion.div
                            ref={menuRef}
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-2 top-8 z-50 w-40 bg-cream-100 dark:bg-surface-darker rounded-lg shadow-lg border border-cream-300 dark:border-surface-muted py-1 overflow-hidden"
                          >
                            {deleteConfirmId === chat.id ? (
                              <div className="p-2">
                                <p className="text-xs text-center text-stone-600 dark:text-stone-300 mb-2">
                                  Delete chat?
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => cancelDelete(e)}
                                    className="flex-1 px-2 py-1 text-xs bg-stone-100 dark:bg-surface-muted rounded hover:bg-stone-200 dark:hover:bg-surface-border text-stone-700 dark:text-stone-200"
                                  >
                                    No
                                  </button>
                                  <button
                                    onClick={(e) => confirmDelete(e, chat.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    Yes
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={(e) => handleRenameClick(e, chat)}
                                  className="w-full text-left px-3 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-cream-200 dark:hover:bg-surface-muted flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Rename
                                </button>
                                <button
                                  onClick={(e) => handleDeleteClick(e, chat.id)}
                                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                )}
              </motion.div>
            </div>
          </div>


          {/* Footer - How to Use */}
          <div className="p-4 border-t border-border dark:border-surface-muted">
            <Link to="/how-to-use" className="flex items-center gap-3 px-2 py-2 text-text-medium dark:text-stone-400 hover:text-primary dark:hover:text-white transition-colors">
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
        className="fixed lg:static top-0 left-0 w-64 lg:w-64 bg-cream-100 dark:bg-surface-dark border-r border-cream-300 dark:border-surface-muted flex flex-col h-screen z-50"
        role="navigation"
        aria-label="Sidebar"
      >
        {/* Close button - only on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-cream-200 dark:hover:bg-surface-muted rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-text-dark dark:text-stone-200" />
        </button>
        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={() => {
              // Use the callback if provided, otherwise just navigate
              if (onNewChat) {
                onNewChat();
              } else {
                navigate('/chat');
              }
              // Close sidebar on mobile after creating new chat
              if (window.innerWidth < 1024) {
                onClose?.();
              }
            }}
            variant="outline"
            className="w-full justify-center gap-2 bg-cream-100 dark:bg-surface-darker hover:bg-cream-200 dark:hover:bg-surface-muted"
            aria-label="Start new chat"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Centered content container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full px-6">
            {/* Chat History Title - centered */}
            <h3 className="text-lg font-roboto font-bold text-text-dark dark:text-stone-100 text-center mb-4">
              Chat History
            </h3>

            {/* Auth Note - directly under Chat History */}
            <p className="text-center text-xs font-inter text-text-medium dark:text-stone-400 leading-relaxed mb-4">
              Log in or sign up to save your conversations.
            </p>
          </div>
        </div>

        {/* Footer - How to Use */}
        <div className="p-4 border-t border-border dark:border-surface-muted">
          <Link to="/how-to-use" className="flex items-center gap-3 px-2 py-2 text-text-medium dark:text-stone-400 hover:text-primary dark:hover:text-white transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">How to use</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
