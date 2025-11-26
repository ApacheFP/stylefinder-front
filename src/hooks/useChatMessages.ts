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

  const loadChatMessages = async (chatId: string, preloadedMessages?: ChatMessage[]) => {
    setCurrentChatId(chatId);
    
    if (preloadedMessages) {
      setMessages(preloadedMessages);
      return;
    }

    // Load from API if not preloaded
    try {
      const fetchedMessages = await chatService.getChatConversation(chatId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to load chat messages:', error);
      showToast.error('Failed to load conversation');
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

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(
        content,
        filters || { outfitType: 'full', selectedItems: [] },
        currentChatId,
        imageFile
      );

      // Update chat ID if this was a new conversation
      if (response.conv_id && !currentChatId) {
        setCurrentChatId(response.conv_id);
        setCurrentChatTitle(response.conv_title);
      }

      // Update user message image URL if backend returned one
      if (response.img_url) {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === userMessage.id 
              ? { ...msg, imageUrl: response.img_url! }
              : msg
          )
        );
      }

      // Transform and add assistant message
      const outfitData = chatService.transformOutfitResponse(response.content);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: outfitData.message,
        timestamp: new Date(),
        outfit: {
          id: `outfit-${Date.now()}`,
          items: outfitData.items,
          totalPrice: outfitData.totalPrice,
          explanation: outfitData.explanation,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      showToast.success('Outfit recommendations ready!');
      onSuccess?.();

    } catch (error) {
      console.error('Failed to send message:', error);
      showToast.error('Failed to get outfit recommendations. Please try again.');
      
      // Remove the temporary user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const explainOutfit = async (messageId: string, _outfitId: string) => {
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
    explainOutfit,
    clearMessages,
    setCurrentChatId,
  };
};
