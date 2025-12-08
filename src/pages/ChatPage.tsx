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
import GenderSelector from '../components/chat/GenderSelector';
import TypingIndicator from '../components/ui/TypingIndicator';
import ScrollToBottomButton from '../components/ui/ScrollToBottomButton';
import KeyboardShortcutsHelper from '../components/ui/KeyboardShortcutsHelper';
import { chatService } from '../services/chatService';
import { beautifyUsername } from '../utils/stringUtils';
import type { ChatHistory } from '../types';

type GuestGender = 'male' | 'female' | 'non-binary';

const ChatPage = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Guest gender for non-authenticated users (persisted in localStorage)
  const [guestGender, setGuestGender] = useState<GuestGender | null>(() => {
    const saved = localStorage.getItem('stylefinder_guest_gender');
    return saved as GuestGender | null;
  });

  // React Router hooks
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  // Auth context
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const isLoggedIn = isAuthenticated;
  let userName = user?.name || 'Guest';
  userName = beautifyUsername(userName);

  // Handle guest gender selection
  const handleGuestGenderSelect = (gender: GuestGender) => {
    setGuestGender(gender);
    localStorage.setItem('stylefinder_guest_gender', gender);
  };

  // Custom hooks - pass guestGender for non-authenticated users
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
    setOnNewMessage,
    selectOutfit,
    selectedOutfitIndex,
    selectedMessageId
  } = useChatMessages(!isAuthenticated ? guestGender ?? undefined : undefined);

  // Auto-scroll behavior
  const { scrollRef, showScrollButton, scrollToBottom, scrollToBottomIfNotScrolledUp, handleScroll } = useScrollToBottom(messages.length);

  // Set scroll callback after scrollToBottom is available
  // Use the conditional scroll for automatic scrolling (respects user's scroll position)
  useEffect(() => {
    setOnNewMessage(scrollToBottomIfNotScrolledUp);
  }, [scrollToBottomIfNotScrolledUp, setOnNewMessage]);

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

  // Track the previous chatId from URL to detect actual navigation changes
  const prevChatIdRef = useRef<string | undefined>(chatId);

  // Track if we're in a guest session with an active conversation
  const guestSessionActiveRef = useRef(false);

  // Load conversation when chatId from URL changes
  useEffect(() => {
    const prevChatId = prevChatIdRef.current;
    prevChatIdRef.current = chatId;

    // If there's a chatId in the URL and it's different from current
    if (chatId && chatId !== currentChatId) {
      setInputMessage('');
      clearImage();
      guestSessionActiveRef.current = false;
      loadChatMessages(chatId).catch((error) => {
        console.error('Failed to load chat from URL:', error);
      });
      return;
    }

    // Guest flow: if currentChatId is set but URL has no chatId
    // Mark the session as active so we don't clear messages
    if (!chatId && currentChatId && !isAuthenticated) {
      guestSessionActiveRef.current = true;
      return;
    }

    // If there's no chatId in URL but we have a currentChatId, reset to new chat state
    // This happens when user navigates back or to /chat directly
    // BUT: Don't reset if this is an active guest session
    if (!chatId && currentChatId) {
      // Case 1: We just navigated here from a chat (prevChatId was defined)
      // Reset to new chat state
      if (prevChatId) {
        if (!guestSessionActiveRef.current) {
          clearMessages();
          setInputMessage('');
          clearImage();
        }
      }
      // Case 2: We were already here (prevChatId was undefined), and currentChatId appeared (New Chat started)
      // Update URL to include the new chat ID
      else if (isAuthenticated) {
        navigate(`/chat/${currentChatId}`, { replace: true });
      }
    }
  }, [chatId, currentChatId, loadChatMessages, clearImage, clearMessages, isAuthenticated]);

  // Update URL when a new chat is created (and we have an ID but URL doesn't)


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
    guestSessionActiveRef.current = false;
    // clearMessages() is handled by the useEffect when URL changes to /chat
    setInputMessage('');
    clearImage();
    // Reset guest gender for a fresh start (optional: remove from localStorage too)
    if (!isAuthenticated) {
      clearMessages();
      setGuestGender(null);
      localStorage.removeItem('stylefinder_guest_gender');
    }
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
    <div className="flex h-screen overflow-hidden bg-background dark:bg-surface-dark">
      {/* Hamburger Menu - Mobile Only */}
      <HamburgerMenu
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        isNewChat={!chatId && messages.length === 0}
        isLoadingHistory={isLoadingHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
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

        <Header chatTitle={currentChatTitle || chatHistory.find(c => c.id === currentChatId)?.title} />

        {/* Gender Selector for non-authenticated users */}
        {!isAuthenticated && (
          <GenderSelector
            selectedGender={guestGender}
            onSelectGender={handleGuestGenderSelect}
            disabled={messages.length > 0}
          />
        )}

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
                    onSelectOutfit={message.role === 'assistant' ? (index) => selectOutfit(index, message.id) : undefined}
                    selectedOutfitIndex={message.role === 'assistant' && selectedMessageId === message.id ? selectedOutfitIndex : undefined}
                  />
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-surface-darker border border-border dark:border-surface-muted px-6 py-4 rounded-2xl flex items-center gap-3">
                    <span className="text-sm font-inter text-text-medium dark:text-stone-300">
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
          disabled={!isAuthenticated && !guestGender}
          disabledMessage={!isAuthenticated && !guestGender ? "Please select your style preference above to start chatting" : undefined}
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
