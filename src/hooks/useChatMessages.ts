import { useState } from 'react';
import type { ChatMessage, OutfitFilters } from '../types';
import { chatService } from '../services/chatService';
import { showToast } from '../utils/toast';
import axios from 'axios';

// Error message helper
const getErrorDetails = (error: unknown): { title: string; message: string } => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;

    switch (status) {
      case 400:
        return {
          title: 'Invalid Request',
          message: serverMessage || 'Please check your message and try again.',
        };
      case 401:
        return {
          title: 'Session Expired',
          message: 'Please log in again to continue.',
        };
      case 403:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
        };
      case 404:
        return {
          title: 'Not Found',
          message: 'The requested resource was not found.',
        };
      case 408:
        return {
          title: 'Request Timeout',
          message: 'The request took too long. Please try again.',
        };
      case 429:
        return {
          title: 'Too Many Requests',
          message: 'Please wait a moment before trying again.',
        };
      case 500:
        // Check if this is a "no results" case, not a real server error
        if (serverMessage && (
          serverMessage.toLowerCase().includes('no candidates') ||
          serverMessage.toLowerCase().includes('no matching products') ||
          serverMessage.toLowerCase().includes('failed to find candidates') ||
          serverMessage.toLowerCase().includes('could not find matching') ||
          serverMessage.toLowerCase().includes('retrieval failed') ||
          serverMessage.toLowerCase().includes('cannot form a full outfit') ||
          serverMessage.toLowerCase().includes('cannot proceed with knapsack')
        )) {
          return {
            title: 'No Results Found',
            message: 'We couldn\'t find products matching your criteria. Try adjusting your preferences or broadening your request.',
          };
        }
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
        };
      case 502:
      case 503:
      case 504:
        return {
          title: 'Service Unavailable',
          message: 'Our servers are temporarily unavailable. Please try again in a few minutes.',
        };
      default:
        if (error.code === 'ECONNABORTED') {
          return {
            title: 'Connection Timeout',
            message: 'The request timed out. Please check your connection and try again.',
          };
        }
        if (error.code === 'ERR_NETWORK') {
          return {
            title: 'Network Error',
            message: 'Unable to connect to the server. Please check your internet connection.',
          };
        }
        return {
          title: 'Something Went Wrong',
          message: serverMessage || 'An unexpected error occurred. Please try again.',
        };
    }
  }

  return {
    title: 'Unexpected Error',
    message: 'Something went wrong. Please try again.',
  };
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
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
      console.log(`DEBUG: Loading chat history for chat ID: ${chatId}`);
      setMessages([]);
      const fetchedMessages = await chatService.getChatConversation(chatId);
      console.log(`DEBUG: Fetched ${fetchedMessages.length} messages for chat ${chatId}`);
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
    setLoadingStatus('Analyzing your request...');

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

      setLoadingStatus('Finding the perfect outfit...');

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
        // Haptic feedback on mobile devices
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
      onSuccess?.();

    } catch (error) {
      console.error('Failed to send message:', error);

      // Get specific error details based on error type
      const errorInfo = getErrorDetails(error);

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
          errorTitle: errorInfo.title,
          errorMessage: errorInfo.message,
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
      setLoadingStatus('');
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
    // Find the message
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1 || !messages[messageIndex].outfit) return;

    // Check if explanation already exists
    if (messages[messageIndex].outfit.explanation) return;

    setLoadingExplanationId(messageId);
    const loadingToastId = showToast.loading('Generating explanation...');

    try {
      // Construct the full conversation history up to this point
      // This ensures the backend understands context like budget, color refinements, etc.
      let userPrompt = "";

      // Iterate through messages up to the current one (exclusive of the current outfit message)
      for (let i = 0; i < messageIndex; i++) {
        const msg = messages[i];
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        // Skip error messages or empty content
        if (msg.isError || !msg.content) continue;

        userPrompt += `${role}: ${msg.content}\n`;
      }

      // Add a final instruction to be clear about what we want, although the backend prompt handles it.
      // But passing the history as the "user_prompt" is the goal.
      // We might want to append a specific request if the history doesn't end with a user question about this outfit
      // (which it might not if there were intermediate steps).
      // However, the backend logic `explain_selected_outfit` takes `user_prompt` and `retrieved_outfit`.
      // It formats it as "*** USER REQUEST *** {user_prompt} *** OUTFIT RETRIEVED *** ...".
      // So passing the history here is perfect.

      if (!userPrompt) {
        // Fallback if no history found (shouldn't happen usually)
        userPrompt = "Please explain this outfit.";
      }

      // Prepare outfit data for backend
      // We need to map frontend items back to a simple structure or just pass them as is if backend accepts
      // Backend expects: { category: string, description: string } or similar?
      // Wait, backend `generate_explanation_only` expects `outfit_data` which is `List[Dict[str, Any]]`.
      // `explain_selected_outfit` uses this data.
      // Let's pass the items with their names/descriptions.
      const outfitData = messages[messageIndex].outfit.items.map(item => ({
        category: item.category || 'unknown', // Frontend might not have category perfectly mapped
        description: item.name, // Use name as description
        brand: item.brand,
        price: item.price
      }));

      const explanation = await chatService.explainOutfit(userPrompt, outfitData);

      // Update message with explanation
      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.id === messageId);
        if (idx !== -1 && updated[idx].outfit) {
          updated[idx] = {
            ...updated[idx],
            outfit: {
              ...updated[idx].outfit!,
              explanation: explanation
            }
          };
        }
        // Update cache
        if (currentChatId) {
          setMessageCache(cache => ({ ...cache, [currentChatId]: updated }));
        }
        return updated;
      });

      showToast.dismiss(loadingToastId);
      showToast.success('Explanation generated!');

    } catch (error) {
      console.error('Failed to generate explanation:', error);
      showToast.dismiss(loadingToastId);
      showToast.error('Failed to generate explanation');
    } finally {
      setLoadingExplanationId(null);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setCurrentChatId(undefined);
    setCurrentChatTitle(undefined);
  };

  return {
    messages,
    isLoading,
    loadingStatus,
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
