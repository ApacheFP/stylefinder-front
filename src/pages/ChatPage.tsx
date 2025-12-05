import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChatMessages } from '../hooks/useChatMessages';
import { useImageUpload } from '../hooks/useImageUpload';
import { useScrollToBottom } from '../hooks/useScrollToBottom';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HamburgerMenu from '../components/ui/HamburgerMenu';
import ChatEmptyState from '../components/chat/ChatEmptyState';
import ChatMessageSkeleton from '../components/chat/ChatMessageSkeleton';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import DragDropOverlay from '../components/chat/DragDropOverlay';
import TypingIndicator from '../components/ui/TypingIndicator';
import ScrollToBottomButton from '../components/ui/ScrollToBottomButton';
import KeyboardShortcutsHelper from '../components/ui/KeyboardShortcutsHelper';
import { chatService } from '../services/chatService';
import { beautifyUsername } from '../utils/stringUtils';
import type { ChatHistory } from '../types';

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // React Router hooks
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  // Auth context
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  let userName = user?.name || 'Guest';
  userName = beautifyUsername(userName);

  // Custom hooks
  const {
    messages,
    isLoading,
    loadingStatus,
    isFetching,
    currentChatId,
    currentChatTitle,
    loadingExplanationId,
    loadChatMessages,
    sendMessage,
    retryMessage,
    explainOutfit,
    clearMessages,
    setOnNewMessage
  } = useChatMessages();

  // Auto-scroll behavior
  const { scrollRef, showScrollButton, scrollToBottom, handleScroll } = useScrollToBottom(messages.length);

  // Set scroll callback after scrollToBottom is available
  useEffect(() => {
    setOnNewMessage(scrollToBottom);
  }, [scrollToBottom, setOnNewMessage]);

  const {
    selectedImage,
    imagePreview,
    isDragging,
    handleImageSelect,
    handleRemoveImage,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    clearImage,
  } = useImageUpload();

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history on mount (only if authenticated and auth check is complete)
  const loadChatHistory = useCallback(async () => {
    // Wait for auth to finish loading
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      setChatHistory([]);
      setIsLoadingHistory(false);
      return;
    }

    try {
      setIsLoadingHistory(true);
      const history = await chatService.getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
      setChatHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [isAuthenticated, isAuthLoading]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Load conversation when chatId from URL changes
  useEffect(() => {
    // If there's a chatId in the URL and it's different from current
    if (chatId && chatId !== currentChatId) {
      setInputMessage('');
      clearImage();
      loadChatMessages(chatId).catch((error) => {
        console.error('Failed to load chat from URL:', error);
      });
    }
    // Note: If chatId === currentChatId, we're already showing the right chat, so do nothing
  }, [chatId, currentChatId, loadChatMessages, clearImage, navigate]);

  // Add new conversation to history when created
  useEffect(() => {
    if (currentChatId && currentChatTitle) {
      // Check if this conversation is already in history using functional update
      setChatHistory((prev) => {
        const exists = prev.some((chat) => chat.id === currentChatId);
        if (!exists) {
          return [
            { id: currentChatId, title: currentChatTitle, lastMessage: new Date() },
            ...prev,
          ];
        }
        return prev;
      });
    }
  }, [currentChatId, currentChatTitle]);

  // Close sidebar on mobile when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useKeyboardShortcuts([
    {
      key: 'k',
      metaKey: true,
      action: () => {
        handleNewChat();
      },
      description: 'New chat',
    },
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        handleNewChat();
      },
      description: 'New chat (Windows/Linux)',
    },
    {
      key: 'i',
      metaKey: true,
      action: () => {
        inputRef.current?.focus();
      },
      description: 'Focus input',
    },
    {
      key: 'i',
      ctrlKey: true,
      action: () => {
        inputRef.current?.focus();
      },
      description: 'Focus input (Windows/Linux)',
    },
  ]);

  const handleNewChat = () => {
    clearMessages();
    setInputMessage('');
    clearImage();
    navigate('/chat');
  };

  const handleSendMessage = () => {
    // Clear input immediately for better UX
    const messageToSend = inputMessage;
    const imageToSend = selectedImage || undefined;

    setInputMessage('');
    clearImage();

    // Scroll to bottom when sending a message
    scrollToBottom();

    sendMessage(messageToSend, imageToSend);
  };

  const showEmptyState = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-gray-900">
      {/* Hamburger Menu - Mobile Only */}
      <HamburgerMenu
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        isLoadingHistory={isLoadingHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onRenameChat={async (chatId, newTitle) => {
          try {
            const success = await chatService.renameConversation(chatId, newTitle);
            if (success) {
              setChatHistory((prev) =>
                prev.map((chat) =>
                  chat.id === chatId ? { ...chat, title: newTitle } : chat
                )
              );
              // Update current chat title if it's the active one
              if (currentChatId === chatId) {
                // We might need a way to update the title in useChatMessages or just rely on history
              }
            }
          } catch (error) {
            console.error('Failed to rename chat:', error);
          }
        }}
        onDeleteChat={async (chatId) => {
          try {
            const success = await chatService.deleteConversation(chatId);
            if (success) {
              setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

              // If deleted chat was active, switch to new chat
              if (currentChatId === chatId) {
                handleNewChat();
              }
            }
          } catch (error) {
            console.error('Failed to delete chat:', error);
          }
        }}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Drag and Drop Overlay */}
        {isDragging && <DragDropOverlay />}

        <Header />

        {/* Messages Area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          {showEmptyState && !isFetching ? (
            <ChatEmptyState
              isLoggedIn={isLoggedIn}
              userName={userName}
              onSuggestionClick={(suggestion) => setInputMessage(suggestion)}
            />
          ) : (
            <div className="max-w-[992px] mx-auto space-y-6">
              {isFetching ? (
                // Show skeletons while fetching history
                <ChatMessageSkeleton />
              ) : (
                // Show actual messages
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onExplainOutfit={explainOutfit}
                    isLoadingExplanation={loadingExplanationId === message.id}
                    onRetry={(msgId, originalMsg, originalImg) => retryMessage(msgId, originalMsg, originalImg)}
                    onContentChange={scrollToBottom}
                  />
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-border dark:border-gray-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <span className="text-sm font-inter text-text-medium dark:text-gray-300">
                      {loadingStatus || 'AI is thinking'}
                    </span>
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scroll to Bottom Button */}
        <ScrollToBottomButton show={showScrollButton} onClick={() => scrollToBottom()} />

        {/* Input Area */}
        <ChatInput
          ref={inputRef}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

        {/* Accessibility: Announce new messages to screen readers */}
        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {messages.length > 0 && `${messages.length} messages in conversation`}
        </div>

        {/* Keyboard Shortcuts Helper - always visible */}
        <KeyboardShortcutsHelper />
      </div>
    </div>
  );
};

export default ChatPage;
