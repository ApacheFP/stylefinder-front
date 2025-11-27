import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChatMessages } from '../hooks/useChatMessages';
import { useImageUpload } from '../hooks/useImageUpload';
// import { useScrollToBottom } from '../hooks/useScrollToBottom'; // 🔧 DISABLED
// import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'; // 🔧 DISABLED
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import HamburgerMenu from '../components/ui/HamburgerMenu';
import ChatEmptyState from '../components/chat/ChatEmptyState';
import ChatMessageSkeleton from '../components/chat/ChatMessageSkeleton';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import DragDropOverlay from '../components/chat/DragDropOverlay';
import TypingIndicator from '../components/ui/TypingIndicator';
import { chatService } from '../services/chatService';
import type { ChatHistory } from '../types';

function beutifyUsername(name: string) {
  return name.trim().toLowerCase().charAt(0).toUpperCase() + name.slice(1)
}
const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [_isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Auth context
  const { isAuthenticated, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  let userName = user?.name || 'Guest';
  userName = beutifyUsername(userName)

  // Custom hooks
  const {
    messages,
    isLoading,
    isFetching,
    currentChatId,
    currentChatTitle,
    loadingExplanationId,
    loadChatMessages,
    sendMessage,
    explainOutfit,
    clearMessages
  } = useChatMessages();

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

  // 🔧 FEATURE DISABLED: Scroll behavior (uncomment to enable)
  // const { scrollRef, showScrollButton, scrollToBottom, handleScroll } = useScrollToBottom(messages.length);
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => { };

  // Sidebar state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history on mount (only if authenticated)
  const loadChatHistory = useCallback(async () => {
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
  }, [isAuthenticated]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Add new conversation to history when created
  useEffect(() => {
    if (currentChatId && currentChatTitle) {
      // Check if this conversation is already in history
      const exists = chatHistory.some((chat) => chat.id === currentChatId);
      if (!exists) {
        setChatHistory((prev) => [
          { id: currentChatId, title: currentChatTitle, lastMessage: new Date() },
          ...prev,
        ]);
      }
    }
  }, [currentChatId, currentChatTitle, chatHistory]);

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

  // 🔧 FEATURE DISABLED: Keyboard shortcuts (uncomment to enable)
  const _inputRef = useRef<HTMLInputElement>(null);
  // useKeyboardShortcuts([...]);

  const handleNewChat = () => {
    clearMessages();
    setInputMessage('');
    clearImage();
  };

  const handleSelectChat = async (chatId: string) => {
    // Don't reload if already on this chat
    if (chatId === currentChatId) return;

    setInputMessage('');
    clearImage();

    try {
      await loadChatMessages(chatId);
      console.log('Loaded chat:', chatId);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage, selectedImage || undefined, undefined, () => {
      setInputMessage('');
      clearImage();
    });
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await chatService.deleteConversation(chatId);
      setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

      // If we deleted the current chat, clear messages
      if (chatId === currentChatId) {
        clearMessages();
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      await chatService.renameConversation(chatId, newTitle);
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
    } catch (error) {
      console.error('Failed to rename chat:', error);
    }
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
        onSelectChat={(chatId) => {
          handleSelectChat(chatId);
          // Close sidebar on mobile after selection
          if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
          }
        }}
        onNewChat={() => {
          handleNewChat();
          // Close sidebar on mobile after creating new chat
          if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
          }
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
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
          className="flex-1 overflow-y-auto p-8"
        >
          {showEmptyState && !isFetching ? (
            <ChatEmptyState
              isLoggedIn={isLoggedIn}
              userName={userName}
              onSuggestionClick={(suggestion) => setInputMessage(suggestion)}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
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
                  />
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-800 border border-border dark:border-gray-700 px-6 py-4 rounded-2xl flex items-center gap-3">
                    <span className="text-sm font-inter text-text-medium dark:text-gray-300">AI is thinking</span>
                    <TypingIndicator />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🔧 FEATURE DISABLED: Scroll to Bottom Button (uncomment to enable) */}
        {/* <ScrollToBottomButton show={showScrollButton} onClick={() => scrollToBottom()} /> */}

        {/* Input Area */}
        <ChatInput
          // ref={inputRef} // 🔧 DISABLED - uncomment when enabling keyboard shortcuts
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          imagePreview={imagePreview}
          selectedImage={selectedImage}
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
