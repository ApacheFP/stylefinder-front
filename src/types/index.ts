// User types
export interface User {
  id: string;
  name: string;
  email: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  gender: 'man' | 'woman' | 'non-binary';
  favoriteStyles: string[];
  favoriteColors: string[];
  favoriteBrands?: string[];
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  outfit?: Outfit;
  imageUrl?: string; // Optional image attached to the message
  isError?: boolean; // True if this is an error message
  errorDetails?: {
    originalMessage: string;
    originalImage?: File;
    errorTitle?: string;
    errorMessage?: string;
  };
  outfits?: Outfit[]; // Support for multiple outfit options
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: Date;
}

// Outfit types
export interface Outfit {
  id: string;
  items: OutfitItem[];
  totalPrice: number;
  remainingBudget?: number;
  explanation?: string;
}

export interface OutfitItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: 'jacket' | 'blazer' | 'shirt' | 'pants' | 'shoes' | 'accessories';
  brand?: string;
  link?: string;
  available?: boolean;
}

// Filter types
export interface OutfitFilters {
  budgetMax?: number;
  outfitType: 'full' | 'partial';
  selectedItems: ('jacket' | 'blazer' | 'shirt' | 'pants' | 'shoes')[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
