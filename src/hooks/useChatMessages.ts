import { useState } from 'react';
import type { ChatMessage, OutfitFilters } from '../types';
import { showToast } from '../utils/toast';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [loadingExplanationId, setLoadingExplanationId] = useState<string | null>(null);

  const loadChatMessages = (chatId: string, chatMessages: ChatMessage[]) => {
    setCurrentChatId(chatId);
    setMessages(chatMessages);
  };

  const sendMessage = async (
    content: string,
    imageUrl?: string,
    _filters?: OutfitFilters, // Prefixed with _ to indicate intentionally unused
    onSuccess?: () => void
  ) => {
    if (!content.trim() && !imageUrl) {
      showToast.error('Please enter a message or attach an image');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content || 'Attached an image',
      timestamp: new Date(),
      imageUrl,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Call API to get outfit recommendations with image
    // For now, use mock response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Absolutely! Here's a great outfit recommendation based on your request:",
        timestamp: new Date(),
        outfit: {
          id: Date.now().toString(),
          totalPrice: 199.97,
          items: [
            {
              id: 'new1',
              name: 'Navy Blue Blazer',
              price: 89.99,
              category: 'blazer',
              brand: 'J.Crew',
              imageUrl: 'https://via.placeholder.com/300x400?text=Navy+Blazer',
              link: '#',
            },
            {
              id: 'new2',
              name: 'Oxford Shirt',
              price: 49.99,
              category: 'shirt',
              brand: 'Brooks Brothers',
              imageUrl: 'https://via.placeholder.com/300x400?text=Oxford+Shirt',
              link: '#',
            },
            {
              id: 'new3',
              name: 'Chino Pants',
              price: 59.99,
              category: 'pants',
              brand: 'Banana Republic',
              imageUrl: 'https://via.placeholder.com/300x400?text=Chino+Pants',
              link: '#',
            },
          ],
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      showToast.success('Outfit recommendations ready!');

      if (!currentChatId) {
        console.log('New conversation started - will be saved to backend');
      }

      onSuccess?.();
    }, 2000);
  };

  const explainOutfit = async (messageId: string, _outfitId: string) => {
    setLoadingExplanationId(messageId);

    const loadingToastId = showToast.loading('Generating explanation...');

    setTimeout(() => {
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      if (messageIndex === -1 || !messages[messageIndex].outfit) return;

      if (messages[messageIndex].outfit?.explanation) {
        console.log('Explanation already generated');
        return;
      }

      console.log('Requesting explanation for outfit:', _outfitId);

      const mockExplanation = "This outfit combination works perfectly because the Navy Blazer adds a professional touch while remaining versatile. The Oxford Shirt provides a clean, classic foundation that pairs well with almost any blazer. The Chino Pants strike the perfect balance between formal and casual, making them ideal for a smart casual setting. Together, these pieces create a cohesive look that's both polished and comfortable.";

      setMessages((prev) => {
        const updated = [...prev];
        if (updated[messageIndex].outfit) {
          updated[messageIndex] = {
            ...updated[messageIndex],
            outfit: {
              ...updated[messageIndex].outfit!,
              explanation: mockExplanation,
            },
          };
        }
        return updated;
      });

      // Clear loading state
      setLoadingExplanationId(null);
      showToast.dismiss(loadingToastId);
      showToast.success('Explanation generated!');
      console.log('Explanation generated and saved to backend');
    }, 2000); // Increased to 1.5s to show the loading animation
  };

  const clearMessages = () => {
    setMessages([]);
    setCurrentChatId(undefined);
  };

  return {
    messages,
    isLoading,
    currentChatId,
    loadingExplanationId,
    loadChatMessages,
    sendMessage,
    explainOutfit,
    clearMessages,
  };
};
