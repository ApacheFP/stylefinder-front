import { useState } from 'react';
import type { ChatMessage, OutfitFilters } from '../types';
import { chatService } from '../services/chatService';
import { showToast } from '../utils/toast';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [currentChatTitle, setCurrentChatTitle] = useState<string | undefined>();
  const [loadingExplanationId, setLoadingExplanationId] = useState<string | null>(null);
  const [messageCache, setMessageCache] = useState<Record<string, ChatMessage[]>>({});

  const [isFetching, setIsFetching] = useState(false);

  const loadChatMessages = async (chatId: string, preloadedMessages?: ChatMessage[]) => {
    setIsFetching(true);
    setCurrentChatId(chatId);
    setCurrentChatTitle(undefined);

    if (preloadedMessages) {
      setMessages(preloadedMessages);
      // Update cache with preloaded messages
      setMessageCache(prev => ({ ...prev, [chatId]: preloadedMessages }));
      setIsFetching(false);
      return;
    }

    // Check cache first
    if (messageCache[chatId]) {
      setMessages(messageCache[chatId]);
      setIsFetching(false);
      // Optional: Background refresh could go here if needed
      return;
    }

    // Load from API if not cached
    try {
      setMessages([]);
      const fetchedMessages = await chatService.getChatConversation(chatId);
      setMessages(fetchedMessages);
      // Update cache
      setMessageCache(prev => ({ ...prev, [chatId]: fetchedMessages }));
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      showToast.error('Failed to load conversation');
    } finally {
      setIsFetching(false);
    }
  };

  const sendMessage = async (
    content: string,
    imageFile?: File,
    filters?: OutfitFilters,
    onSuccess?: () => void
  ) => {
    if (!content.trim() && !imageFile) {
      showToast.error('Please enter a message or attach an image');
      return;
    }

    // Create user message for immediate display
    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: content || 'Attached an image',
      timestamp: new Date(),
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    // Update messages and cache immediately (optimistic)
    const updateMessagesAndCache = (newMsg: ChatMessage) => {
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        if (currentChatId) {
          setMessageCache(cache => ({ ...cache, [currentChatId]: updated }));
        }
        return updated;
      });
    };

    updateMessagesAndCache(userMessage);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        content,
        filters || { outfitType: 'full', selectedItems: [] },
        currentChatId,
        imageFile
      );

      // Update chat ID if this was a new conversation
      let activeChatId = currentChatId;
      if (response.conv_id && !currentChatId) {
        // Ensure conv_id is a string (backend may return a number)
        activeChatId = String(response.conv_id);
        setCurrentChatId(activeChatId);
        setCurrentChatTitle(response.conv_title);
      }

      // Update user message image URL if backend returned one
      if (response.img_url) {
        setMessages((prev) => {
          const updated = prev.map((msg) => {
            if (msg.id === userMessage.id) {
              // Revoke the temporary object URL to prevent memory leak
              if (msg.imageUrl && msg.imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(msg.imageUrl);
              }
              return { ...msg, imageUrl: response.img_url! };
            }
            return msg;
          });
          if (activeChatId) {
            setMessageCache(cache => ({ ...cache, [activeChatId!]: updated }));
          }
          return updated;
        });
      }

      // Transform and add assistant message
      const outfitData = chatService.transformOutfitResponse(response.content, response.status);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: outfitData.message,
        timestamp: new Date(),
        // Only include outfit if it's a COMPLETED response with items
        outfit: outfitData.hasOutfit && outfitData.items.length > 0 ? {
          id: `outfit-${Date.now()}`,
          items: outfitData.items,
          totalPrice: outfitData.totalPrice,
          explanation: outfitData.explanation,
        } : undefined,
      };

      // Add assistant message to state and cache
      setMessages((prev) => {
        const updated = [...prev, assistantMessage];
        if (activeChatId) {
          setMessageCache(cache => ({ ...cache, [activeChatId!]: updated }));
        }
        return updated;
      });

      // Show appropriate toast based on response status
      if (outfitData.status === 'COMPLETED' && outfitData.hasOutfit) {
        showToast.success('Outfit recommendations ready!');
      }
      onSuccess?.();

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Create an error message to display in the chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isError: true,
        errorDetails: {
          originalMessage: content,
          originalImage: imageFile,
        },
      };

      // Keep the user message but add an error response
      setMessages((prev) => {
        const updated = [...prev, errorMessage];
        if (currentChatId) {
          setMessageCache(cache => ({ ...cache, [currentChatId]: updated }));
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retryMessage = async (
    errorMessageId: string,
    originalMessage: string,
    originalImage?: File,
    filters?: OutfitFilters
  ) => {
    // Remove the error message
    setMessages((prev) => {
      const updated = prev.filter((msg) => msg.id !== errorMessageId);
      if (currentChatId) {
        setMessageCache(cache => ({ ...cache, [currentChatId]: updated }));
      }
      return updated;
    });

    // Also remove the original user message that preceded the error
    setMessages((prev) => {
      // Find and remove the last user message (which was the failed one)
      const lastUserMsgIndex = [...prev].reverse().findIndex(msg => msg.role === 'user');
      if (lastUserMsgIndex !== -1) {
        const actualIndex = prev.length - 1 - lastUserMsgIndex;
        const updated = prev.filter((_, i) => i !== actualIndex);
        if (currentChatId) {
          setMessageCache(cache => ({ ...cache, [currentChatId]: updated }));
        }
        return updated;
      }
      return prev;
    });

    // Retry sending the message
    await sendMessage(originalMessage, originalImage, filters);
  };

  const explainOutfit = async (messageId: string) => {
    // The backend already returns explanation with the outfit
    // This function now just reveals the existing explanation
    setLoadingExplanationId(messageId);

    const loadingToastId = showToast.loading('Loading explanation...');

    // Simulate brief loading for UX
    setTimeout(() => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1 || !messages[messageIndex].outfit) {
        showToast.dismiss(loadingToastId);
        setLoadingExplanationId(null);
        return;
      }

      // Explanation is already in the outfit from backend
      setLoadingExplanationId(null);
      showToast.dismiss(loadingToastId);
      showToast.success('Explanation loaded!');
    }, 500);
  };

  const clearMessages = () => {
    setMessages([]);
    setCurrentChatId(undefined);
    setCurrentChatTitle(undefined);
  };

  return {
    messages,
    isLoading,
    currentChatId,
    currentChatTitle,
    loadingExplanationId,
    loadChatMessages,
    sendMessage,
    retryMessage,
    explainOutfit,
    clearMessages,
    isFetching,
    setCurrentChatId,
  };
};
