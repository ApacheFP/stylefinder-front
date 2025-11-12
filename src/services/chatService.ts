import api from './api';
import type { ChatMessage, ChatHistory, OutfitFilters } from '../types';

/**
 * Chat Service
 * 
 * NOTE FOR BACKEND TEAM:
 * These endpoints handle the AI chat and outfit recommendations.
 * See BACKEND_INTEGRATION.md for detailed API specifications.
 */

export const chatService = {
  // Send a message and get outfit recommendations (with optional image)
  sendMessage: async (message: string, filters: OutfitFilters, chatId?: string, imageFile?: File) => {
    // If there's an image, use FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('filters', JSON.stringify(filters));
      formData.append('image', imageFile);
      if (chatId) {
        formData.append('chatId', chatId);
      }

      const response = await api.post('/chat/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Otherwise, send JSON
    const response = await api.post('/chat/message', {
      message,
      filters,
      chatId,
    });
    return response.data;
  },

  // Get chat history
  getChatHistory: async (): Promise<ChatHistory[]> => {
    const response = await api.get('/chat/history');
    return response.data;
  },

  // Get specific chat conversation
  getChatConversation: async (chatId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/chat/${chatId}`);
    return response.data;
  },

  // Create new chat
  createNewChat: async () => {
    const response = await api.post('/chat/new');
    return response.data;
  },

  // Get outfit explanation
  explainOutfit: async (outfitId: string) => {
    const response = await api.post(`/chat/explain/${outfitId}`);
    return response.data;
  },
};
