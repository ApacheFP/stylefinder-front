import type { User, ChatHistory, ChatMessage, Outfit } from '../types';

// Mock User Data
export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    gender: 'man',
    favoriteStyles: ['Casual', 'Minimalist'],
    favoriteColors: ['Blue', 'Black'],
  },
};

// Mock Chat History
export const mockChatHistory: ChatHistory[] = [
  {
    id: '1',
    title: 'Interview outfit 200€',
    lastMessage: new Date('2025-11-10'),
  },
  {
    id: '2',
    title: 'Summer wedding look',
    lastMessage: new Date('2025-11-09'),
  },
];

// Mock Outfits
export const mockOutfit1: Outfit = {
  id: '1',
  totalPrice: 199.97,
  items: [
    {
      id: '1',
      name: 'Navy Blue Blazer',
      price: 89.99,
      category: 'blazer',
      brand: 'J.Crew',
    },
    {
      id: '2',
      name: 'Oxford Shirt',
      price: 49.99,
      category: 'shirt',
      brand: 'Brooks Brothers',
    },
    {
      id: '3',
      name: 'Chino Pants',
      price: 59.99,
      category: 'pants',
      brand: 'Banana Republic',
    },
  ],
  explanation:
    "This 'smart casual' combination is perfect for an interview. The Navy Blazer projects professionalism and confidence. The Oxford Shirt is a timeless classic that keeps the look clean, and the Chino Pants are more relaxed than suit trousers, hitting the 'smart casual' note perfectly while staying well within your $200 budget.",
};

export const mockOutfit2: Outfit = {
  id: '2',
  totalPrice: 329.97,
  items: [
    {
      id: '4',
      name: 'Light Gray Suit',
      price: 199.99,
      category: 'blazer',
      brand: 'Hugo Boss',
    },
    {
      id: '5',
      name: 'White Linen Shirt',
      price: 59.99,
      category: 'shirt',
      brand: 'Zara',
    },
    {
      id: '6',
      name: 'Brown Loafers',
      price: 79.99,
      category: 'shoes',
      brand: 'Cole Haan',
    },
  ],
  explanation:
    "The Light Gray Suit is formal enough for a wedding but light enough for summer. The Linen Shirt is breathable and comfortable, and the Brown Loafers add a touch of relaxed elegance without needing socks.",
};

// Mock Chat Messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content:
      "Hi! I'm looking for an outfit for an important interview, but I don't want to spend more than 200€. I'd like a smart casual style and I'm only interested in a jacket, shirt, and pants.",
    timestamp: new Date('2025-11-10T10:00:00'),
  },
  {
    id: '2',
    role: 'assistant',
    content:
      'Absolutely! Given the filters (budget $200, smart casual style, partial), here is an excellent proposal for the requested items:',
    timestamp: new Date('2025-11-10T10:00:30'),
    outfit: mockOutfit1,
  },
];

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockAuth = {
  login: async (email: string, password: string) => {
    await delay(1000);
    if (email && password) {
      return {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    throw new Error('Invalid credentials');
  },

  signUp: async (name: string, email: string) => {
    await delay(1000);
    return {
      id: '1',
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D6EFD&color=fff`
    };
  },
};

export const mockChatAPI = {
  sendMessage: async () => {
    await delay(1000);
    // Return a mock outfit response
    return {
      id: Date.now().toString(),
      text: "I've found some items that match your description. Would you like to see them?",
      sender: 'ai' as const,
      timestamp: new Date(),
    };
  },
};
