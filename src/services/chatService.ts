import api from './api';
import type { ChatHistory, OutfitFilters, OutfitItem } from '../types';

/**
 * Chat Service
 * 
 * Backend endpoints:
 *   POST /messages/send - Send message and get outfit recommendations
 *   GET /conversations - Get chat history list
 *   GET /chat - Get messages for a specific conversation (conv_id in body)
 *   PUT /conversations/rename - Rename a conversation
 *   DELETE /conversations/delete - Delete a conversation
 */

// Backend response types
interface BackendOutfitItem {
  id: string;
  title: string;
  url: string;
  image_link: string;
  price: number;
  similarity?: number;
}

interface BackendOutfitResponse {
  outfit: BackendOutfitItem[];
  message: string;
  explanation: string;
  status_code: number;
}

interface SendMessageResponse {
  conv_id?: string;
  conv_title?: string;
  img_url?: string | null;
  content: BackendOutfitResponse;
}

interface BackendMessage {
  id?: string;
  role: 'user' | 'ai';
  content: string;
  image_id?: string | null;
  explanation?: string;
  outfits?: BackendOutfitItem[];
  timestamp?: string;
}

interface BackendConversation {
  id: number;
  title: string;
  last_message?: string;
  created_at?: string;
  updated_at?: string;
}

// Transform backend outfit items to frontend format
const transformOutfitItems = (backendItems: BackendOutfitItem[]): OutfitItem[] => {
  return backendItems.map((item, index) => ({
    id: item.id || String(index),
    name: item.title,
    price: item.price,
    imageUrl: item.image_link,
    category: 'accessories' as const, // Backend doesn't provide category, use default
    link: item.url,
  }));
};

// Calculate total price from items
const calculateTotalPrice = (items: BackendOutfitItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
};

export const chatService = {
  // Send a message and get outfit recommendations (with optional image)
  sendMessage: async (
    message: string,
    _filters: OutfitFilters, // Currently unused by backend, but kept for future use
    convId?: string,
    imageFile?: File
  ): Promise<SendMessageResponse> => {
    // If there's an image, use FormData
    if (imageFile) {
      const formData = new FormData();
      formData.append('message', message);
      if (convId) {
        formData.append('conv_id', convId);
      }
      formData.append('image', imageFile);
      // Note: filters are not used by current backend, but we include message

      const response = await api.post<SendMessageResponse>('/messages/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Otherwise, send JSON
    const response = await api.post<SendMessageResponse>('/messages/send', {
      message,
      conv_id: convId,
    });
    return response.data;
  },

  // Get chat history (list of conversations)
  getChatHistory: async (): Promise<ChatHistory[]> => {
    const response = await api.get<{ success: boolean; conversations: BackendConversation[] }>('/conversations');
    
    return response.data.conversations.map((conv) => ({
      id: String(conv.id),
      title: conv.title,
      lastMessage: conv.updated_at ? new Date(conv.updated_at) : new Date(),
    }));
  },

  // Get specific chat conversation messages
  getChatConversation: async (convId: string) => {
    // Note: Backend uses GET with body (unusual), might need adjustment
    const response = await api.get<BackendMessage[]>('/chat', {
      data: { conv_id: convId },
    });
    
    return response.data.map((msg, index) => ({
      id: msg.id || String(index),
      role: msg.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
      imageUrl: msg.image_id || undefined,
      outfit: msg.outfits && msg.outfits.length > 0 ? {
        id: String(index),
        items: transformOutfitItems(msg.outfits),
        totalPrice: calculateTotalPrice(msg.outfits),
        explanation: msg.explanation,
      } : undefined,
    }));
  },

  // Rename a conversation
  renameConversation: async (convId: string, newTitle: string): Promise<boolean> => {
    const response = await api.put<{ success: boolean }>('/conversations/rename', {
      conv_id: convId,
      title: newTitle,
    });
    return response.data.success;
  },

  // Delete a conversation
  deleteConversation: async (convId: string): Promise<boolean> => {
    const response = await api.delete<{ success: boolean }>('/conversations/delete', {
      data: { conv_id: parseInt(convId) },
    });
    return response.data.success;
  },

  // Transform backend response to frontend ChatMessage format
  transformOutfitResponse: (backendResponse: BackendOutfitResponse) => {
    return {
      items: transformOutfitItems(backendResponse.outfit),
      totalPrice: calculateTotalPrice(backendResponse.outfit),
      explanation: backendResponse.explanation,
      message: backendResponse.message,
    };
  },
};
