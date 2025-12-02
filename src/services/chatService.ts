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
  brand?: string;
  material?: string;
  similarity?: number;
}

// New response status types from backend
type ResponseStatus = 'AWAITING_INPUT' | 'Guardrail' | 'COMPLETED';

interface BackendOutfitResponse {
  outfit: BackendOutfitItem[];
  message: string;
  explanation?: string;
}

interface SendMessageResponse {
  status: ResponseStatus;
  conv_id?: number | string;
  conv_title?: string;  // Optional: title for new conversations
  img_url?: string | null;
  content: BackendOutfitResponse;
}

interface BackendMessage {
  message_id?: number;
  role: 'user' | 'model';  // Backend now uses 'model' instead of 'ai'
  text: string;  // Backend uses 'text', not 'content'
  type?: number;  // 0 = outfit, 1 = normal message (default: 0)
  image_id?: string | null;
  explanation?: string;
  outfit?: BackendOutfitItem[];
  created_at?: string;  // Backend uses 'created_at', not 'timestamp'
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
  const seenIds = new Set<string>();
  return backendItems.map((item, index) => {
    let id = item.id || `item-${index}-${Date.now()}`;
    if (seenIds.has(id)) {
      id = `${id}-dup-${index}`;
    }
    seenIds.add(id);

    return {
      id,
      name: item.title,
      price: item.price,
      imageUrl: item.image_link,
      category: 'accessories' as const, // Backend doesn't provide category, use default
      brand: item.brand,
      link: item.url,
    };
  });
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
    // Use POST with JSON body since GET with body is not standard
    // Backend expects conv_id in JSON body
    const response = await api.post<BackendMessage[]>('/chat', { conv_id: convId });
    console.log('DEBUG: Raw history response:', response.data);

    const seenIds = new Set<string>();
    const parsedMessages = response.data.map((msg, index) => {
      const messageType = msg.type ?? 0; // Default to 0 (outfit) if not provided
      const hasOutfit = messageType === 0 && msg.outfit && msg.outfit.length > 0;

      let id = msg.message_id?.toString() || `msg-${index}-${Date.now()}`;
      if (seenIds.has(id)) {
        id = `${id}-dup-${index}`;
      }
      seenIds.add(id);

      return {
        id,
        role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
        content: msg.text,  // Backend uses 'text'
        timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),  // Backend uses 'created_at'
        imageUrl: msg.image_id || undefined,
        outfit: hasOutfit ? {
          id: `outfit-${id}`, // Use message ID to ensure outfit ID is also unique and related
          items: transformOutfitItems(msg.outfit!),
          totalPrice: calculateTotalPrice(msg.outfit!),
          explanation: msg.explanation,
        } : undefined,
      };
    });

    console.log('DEBUG: Parsed messages:', response.data.map(m => ({ id: m.message_id, hasOutfit: m.outfit && m.outfit.length > 0 })));
    return parsedMessages;
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
    const numericId = parseInt(convId, 10);
    if (isNaN(numericId)) {
      console.error('Invalid conversation ID:', convId);
      return false;
    }
    const response = await api.delete<{ success: boolean }>('/conversations/delete', {
      data: { conv_id: numericId },
    });
    return response.data.success;
  },

  // Transform backend response to frontend ChatMessage format
  // Status: COMPLETED = outfit response, AWAITING_INPUT = needs more info, Guardrail = blocked
  transformOutfitResponse: (backendResponse: BackendOutfitResponse, status: ResponseStatus) => {
    const hasOutfit = backendResponse.outfit && backendResponse.outfit.length > 0;

    // AWAITING_INPUT or Guardrail: No outfit, just message
    if (status !== 'COMPLETED' || !hasOutfit) {
      return {
        status,
        hasOutfit: false,
        message: backendResponse.message,
        items: [],
        totalPrice: 0,
        explanation: '',
      };
    }

    // COMPLETED with outfit
    return {
      status,
      hasOutfit: true,
      items: transformOutfitItems(backendResponse.outfit || []),
      totalPrice: calculateTotalPrice(backendResponse.outfit || []),
      explanation: backendResponse.explanation || '',
      message: backendResponse.message,
    };
  },
};
