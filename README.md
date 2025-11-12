# 👗 StyleFinder AI - Frontend

StyleFinder AI is a web-based smart application designed to solve the common challenge of outfit creation and shopping indecision. The system allows users to express their needs in natural language and instantly receive curated, ready-to-buy looks assembled from live e-commerce platforms.

---

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes ⚡
- **[PROJECT_TREE.md](./PROJECT_TREE.md)** - Visual project structure 📁
- **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** - Complete project deliverables 🎉
- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - Complete documentation index 📚
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Supabase integration guide 🗄️
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Mock data to Supabase migration 🔄
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current project status ✅

---

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **Context API** - State management

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the project folder:
```bash
cd stylefinder-front
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header)
│   ├── ui/             # Base UI components (Button, Input, ProductCard, HamburgerMenu)
│   └── chat/           # Chat-specific components (ChatInput, ChatMessage, ChatEmptyState)
├── pages/              # Page components (LandingPage, LoginPage, SignUpPage, ChatPage, PreferencesPage)
├── context/            # React Context providers (AuthContext)
├── services/           # API services and data fetching (authService, chatService, preferencesService)
├── hooks/              # Custom React hooks (useChatMessages, useImageUpload, useScrollToBottom)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (mockData, animations, toast)
```

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features (UI Implementation)

### Core Features
- ✅ **Landing Page** - Hero section with CTA
- ✅ **Login/Sign Up Pages** - Authentication UI (backend to implement)
- ✅ **Preferences Modal** - User preferences selection UI
- ✅ **Chat Interface** - Main chat UI with sidebar and message display
- ✅ **Product Cards** - Outfit item display cards with hover effects
- ✅ **Chat History Sidebar** - Conversation history UI with collapsible mobile view
- ✅ **Budget & Style Filters** - Filter controls UI with dynamic partial outfit selection
- ✅ **Mock Data** - Working with fake data until backend is ready
- ✅ **API Layer Ready** - Services prepared for backend integration

### Advanced Features
- ✅ **Drag & Drop Image Upload** - Visual overlay, format validation, preview, and removal
- ✅ **Explain This Outfit** - Generate AI explanations for outfit recommendations
- ✅ **Responsive Design** - Fully responsive across mobile, tablet, and desktop
- ✅ **Toast Notifications** - User feedback with react-hot-toast
- ✅ **Loading States** - Professional loading indicators (skeleton, typing, animated dots)
- ✅ **Smooth Animations** - Framer Motion animations for better UX
- ✅ **Empty States** - Engaging empty states for chat and history
- ✅ **Hamburger Menu** - Mobile-friendly navigation with overlay sidebar
- ✅ **Smooth Image Loading** - Blur placeholder effect for product images
- ✅ **Hover States** - Enhanced interactions across all components
- ✅ **Scroll Optimization** - Smooth scrolling to new messages

## � Responsive Design

StyleFinder AI is **fully responsive** and optimized for all devices:

- **Mobile** (< 768px) - Collapsible sidebar with hamburger menu, stacked filters, single-column product grid
- **Tablet** (768px - 1024px) - Two-column product grid, optimized touch targets
- **Desktop** (> 1024px) - Full sidebar, three-column product grid, hover effects

All components follow mobile-first approach with proper touch targets (≥ 44px) and responsive typography.

See `RESPONSIVE_COMPLETE.md` for detailed implementation notes.

---

## 🗄️ Database Integration with Supabase

StyleFinder AI is designed to work seamlessly with **Supabase** as the backend database and authentication provider. Below is a comprehensive guide for integrating Supabase into your project.

### 🎯 Why Supabase?

- **PostgreSQL Database** - Powerful relational database with real-time capabilities
- **Built-in Authentication** - Email/password, OAuth, magic links
- **Storage** - Image and file storage for user uploads
- **Real-time Subscriptions** - Live updates for chat messages
- **Row Level Security (RLS)** - Secure data access per user
- **REST API** - Auto-generated API endpoints
- **Edge Functions** - Serverless functions for AI integration

### 📦 Installation

```bash
npm install @supabase/supabase-js
```

### 🔧 Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Add environment variables** to `.env`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **Create Supabase client** (`src/lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 📊 Database Schema

Create the following tables in your Supabase project:

#### 1. **users** table (auto-created by Supabase Auth)
- Extended with custom fields via `profiles` table

#### 2. **profiles** table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 3. **user_preferences** table
```sql
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  styles TEXT[] DEFAULT '{}',
  budget_min INTEGER,
  budget_max INTEGER,
  favorite_colors TEXT[] DEFAULT '{}',
  size_top TEXT,
  size_bottom TEXT,
  size_shoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
```

#### 4. **chats** table
```sql
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own chats"
  ON chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chats"
  ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
  ON chats FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats"
  ON chats FOR DELETE
  USING (auth.uid() = user_id);
```

#### 5. **messages** table
```sql
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view messages from own chats"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own chats"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

-- Index for faster queries
CREATE INDEX messages_chat_id_idx ON messages(chat_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);
```

#### 6. **outfits** table
```sql
CREATE TABLE outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  style TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can view outfits from own messages"
  ON outfits FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages
      JOIN chats ON chats.id = messages.chat_id
      WHERE messages.id = outfits.message_id
      AND chats.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX outfits_message_id_idx ON outfits(message_id);
```

#### 7. **outfit_items** table
```sql
CREATE TABLE outfit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  product_link TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Users can view outfit items from own outfits"
  ON outfit_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM outfits
      JOIN messages ON messages.id = outfits.message_id
      JOIN chats ON chats.id = messages.chat_id
      WHERE outfits.id = outfit_items.outfit_id
      AND chats.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX outfit_items_outfit_id_idx ON outfit_items(outfit_id);
```

#### 8. **chat_filters** table
```sql
CREATE TABLE chat_filters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  budget_max INTEGER,
  outfit_type TEXT CHECK (outfit_type IN ('complete', 'partial')),
  selected_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id)
);

-- Enable RLS
ALTER TABLE chat_filters ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view filters from own chats"
  ON chat_filters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_filters.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert filters to own chats"
  ON chat_filters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_filters.chat_id
      AND chats.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update filters in own chats"
  ON chat_filters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = chat_filters.chat_id
      AND chats.user_id = auth.uid()
    )
  );
```

### 🔐 Authentication Integration

Update `src/context/AuthContext.tsx` to use Supabase Auth:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### 📝 Service Layer Integration

Update service files to use Supabase instead of Axios:

#### **chatService.ts** example:
```typescript
import { supabase } from '../lib/supabase';
import type { Message, Outfit } from '../types';

export const chatService = {
  // Create new chat
  async createChat(title: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('chats')
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  // Get chat history
  async getChatHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get messages for a chat
  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        outfits (
          *,
          outfit_items (*)
        )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Transform data to match frontend types
    return data.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      imageUrl: msg.image_url,
      outfits: msg.outfits?.map((outfit: any) => ({
        id: outfit.id,
        style: outfit.style,
        totalPrice: outfit.total_price,
        explanation: outfit.explanation,
        items: outfit.outfit_items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: item.price,
          imageUrl: item.image_url,
          link: item.product_link,
          category: item.category
        }))
      }))
    }));
  },

  // Send message (call AI backend/edge function)
  async sendMessage(chatId: string, content: string, imageData?: string) {
    // Insert user message
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: userMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role: 'user',
        content,
        image_url: imageData
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // Call your AI backend/edge function to generate response
    // This could be a Supabase Edge Function that:
    // 1. Calls OpenAI/Claude API
    // 2. Fetches products from e-commerce APIs
    // 3. Generates outfit recommendations
    // 4. Inserts assistant message with outfits

    // Example edge function call:
    const { data, error } = await supabase.functions.invoke('generate-outfit', {
      body: { chatId, message: content, imageData }
    });

    if (error) throw error;
    return data;
  }
};
```

### 🖼️ Storage Integration

Use Supabase Storage for user-uploaded images:

```typescript
// Upload image
export async function uploadImage(file: File, userId: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file);

  if (error) throw error;

  // Get public URL
  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
```

### 🔔 Real-time Updates

Subscribe to new messages in a chat:

```typescript
// In your chat component
useEffect(() => {
  const channel = supabase
    .channel(`chat:${chatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`
      },
      (payload) => {
        // Add new message to state
        setMessages(prev => [...prev, payload.new as Message]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [chatId]);
```

### 🚀 Deployment with Supabase

1. **Set up Storage bucket** - Create `chat-images` bucket in Supabase Storage
2. **Enable Row Level Security** - All tables should have RLS enabled
3. **Create Edge Functions** - Deploy AI integration as Supabase Edge Functions
4. **Environment Variables** - Add Supabase credentials to your deployment platform
5. **Test thoroughly** - Ensure all CRUD operations work correctly

### 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Real-time](https://supabase.com/docs/guides/realtime)

---

## �🔌 Backend Integration Guide (Alternative to Supabase)

If you prefer to build a custom backend instead of using Supabase, this section describes the required API endpoints.

This is a **frontend-only implementation**. The backend team needs to implement the API endpoints described below.

### 📋 Overview for Backend Team

The frontend is **fully functional** with mock data and ready for integration. All API calls are abstracted in service layers, making integration straightforward.

### 🗂️ What's Already Implemented (Frontend)

- ✅ Complete service layer in `src/services/`
- ✅ TypeScript interfaces for all requests/responses in `src/types/`
- ✅ Axios HTTP client configured with interceptors in `src/services/api.ts`
- ✅ JWT token management (automatic header injection)
- ✅ Error handling and user feedback (toast notifications)
- ✅ Mock data in `src/utils/mockData.ts` (temporary, for UI development)

### 🔗 Required API Endpoints

#### 1. Authentication (`src/services/authService.ts`)

**POST** `/api/auth/register`
```typescript
// Request body
{
  email: string;
  password: string;
  name: string;
}

// Response
{
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

**POST** `/api/auth/login`
```typescript
// Request body
{
  email: string;
  password: string;
}

// Response
{
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

**GET** `/api/auth/me` (requires authentication)
```typescript
// Response
{
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
}
```

#### 2. User Preferences (`src/services/preferencesService.ts`)

**GET** `/api/preferences` (requires authentication)
```typescript
// Response
{
  styles: string[];        // e.g., ["casual", "elegant", "sporty"]
  budget: {
    min: number;
    max: number;
  };
  favoriteColors: string[]; // e.g., ["black", "blue", "white"]
  sizes: {
    top?: string;          // e.g., "M", "L"
    bottom?: string;
    shoes?: string;
  };
}
```

**POST** `/api/preferences` (requires authentication)
```typescript
// Request body
{
  styles: string[];
  budget: {
    min: number;
    max: number;
  };
  favoriteColors: string[];
  sizes: {
    top?: string;
    bottom?: string;
    shoes?: string;
  };
}

// Response
{
  success: boolean;
  preferences: UserPreferences; // Same as above
}
```

#### 3. Chat & AI Recommendations (`src/services/chatService.ts`)

**POST** `/api/chat/message` (requires authentication)
```typescript
// Request body
{
  message: string;
  chatId?: string;         // If continuing existing chat
  imageData?: string;      // Base64 encoded image (optional)
}

// Response
{
  chatId: string;
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;     // ISO 8601 format
    outfits?: Outfit[];    // Array of outfit recommendations
  }
}
```

**GET** `/api/chat/history` (requires authentication)
```typescript
// Response
{
  chats: Array<{
    id: string;
    title: string;         // First user message (truncated)
    lastMessage: string;
    timestamp: string;     // ISO 8601 format
    messageCount: number;
  }>
}
```

**GET** `/api/chat/:chatId` (requires authentication)
```typescript
// Response
{
  id: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    outfits?: Outfit[];
  }>
}
```

### 📦 TypeScript Type Definitions

All types are defined in `src/types/index.ts`:

```typescript
interface OutfitItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  link: string;          // URL to product on e-commerce site
  category: string;      // e.g., "top", "bottom", "shoes", "accessories"
}

interface Outfit {
  id: string;
  items: OutfitItem[];
  totalPrice: number;
  style: string;         // e.g., "casual", "elegant"
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  outfits?: Outfit[];
  imageUrl?: string;     // If user uploaded image
}
```

### 🔧 Integration Steps for Backend Team

1. **Set up CORS**: Allow requests from `http://localhost:5173` (development) and your production frontend URL
2. **Implement JWT authentication**: Frontend expects `Bearer <token>` in Authorization header
3. **Handle file uploads**: For image-based outfit recommendations (base64 or multipart/form-data)
4. **Error responses**: Return proper HTTP status codes and error messages in format:
   ```json
   {
     "error": "Error message here",
     "code": "ERROR_CODE"
   }
   ```
5. **Test with frontend**: Update `.env` file with `VITE_API_BASE_URL=http://your-backend-url`

### 🔄 How to Integrate

**Step 1**: Backend team implements endpoints listed above

**Step 2**: Update environment variable in `.env`:
```bash
VITE_API_BASE_URL=http://localhost:8000  # or your backend URL
```

**Step 3**: Remove mock responses in service files:
- `src/services/authService.ts`
- `src/services/preferencesService.ts`
- `src/services/chatService.ts`

**Step 4**: Test integration - all UI features should work with real data!

### 📝 Notes for Backend Team

- **AI Integration**: The chat endpoint should integrate with an AI model (e.g., OpenAI, Claude) to:
  - Understand user requests (natural language)
  - Fetch products from e-commerce APIs (Zalando, ASOS, etc.)
  - Generate outfit recommendations based on user preferences
  - Handle image uploads for visual search
  
- **Product Data**: You'll need to integrate with e-commerce APIs or scrape product data
  
- **Caching**: Consider caching AI responses and product data for better performance
  
- **Rate Limiting**: Implement rate limiting for AI API calls

### 📞 Questions?

For questions about the frontend implementation or API contracts, contact the frontend team or check:
- `BACKEND_INTEGRATION.md` - Detailed backend integration guide
- `src/types/index.ts` - All TypeScript interfaces
- `src/services/*.ts` - Service layer implementation

---

## 📚 Additional Documentation

- **`PROJECT_STATUS.md`** - Current project status and completed features
- **`DEVELOPMENT_NOTES.md`** - Development process notes and decisions
- **`RESPONSIVE_COMPLETE.md`** - Detailed responsive design implementation
- **`RESPONSIVE_PLAN.md`** - Original responsive design plan
- **`REFACTORING.md`** - Code refactoring notes and component breakdown
- **`BACKEND_INTEGRATION.md`** - Complete backend integration guide

## 🎯 Current Status

### ✅ Completed Features

- **UI/UX Design** - Fully implemented from Figma mockup
- **Responsive Design** - Mobile, tablet, and desktop optimized
- **Authentication Flow** - Login, sign up, preferences UI
- **Chat Interface** - Complete chat UI with message history
- **Filters** - Budget and outfit type filters with partial selection
- **Product Cards** - Beautiful product display with hover effects
- **Image Upload** - Drag & drop with validation and preview
- **AI Explanations** - "Explain this outfit" feature
- **Loading States** - Professional loading indicators throughout
- **Animations** - Smooth transitions with Framer Motion
- **Toast Notifications** - User feedback system
- **Empty States** - Engaging empty states for better UX
- **Mobile Navigation** - Hamburger menu with collapsible sidebar

### 🔄 Ready for Integration

- **Supabase Setup** - Complete database schema and integration guide provided
- **API Layer** - All services ready to connect to backend
- **Authentication** - AuthContext prepared for Supabase Auth
- **Real-time** - Ready for real-time message subscriptions
- **Storage** - Image upload ready for Supabase Storage
- **Type Safety** - Full TypeScript coverage with strict types

### 🚧 Next Steps

1. **Set up Supabase project** - Create database and configure tables
2. **Implement Edge Functions** - AI integration for outfit generation
3. **Connect services** - Replace mock data with real Supabase queries
4. **Test integration** - End-to-end testing with real data
5. **Deploy** - Deploy to production with environment variables
6. **Monitor** - Set up error tracking and analytics

## 🤝 Contributing

This is a frontend-only implementation. When contributing:

1. Follow the existing code structure and naming conventions
2. Use TypeScript for all new files
3. Write responsive components (mobile-first)
4. Add proper type definitions in `src/types/`
5. Update documentation when adding features
6. Test on multiple screen sizes
7. Ensure accessibility (ARIA labels, keyboard navigation)

## 📄 License

This project is private and proprietary.

---

## 💡 Tips for Development

### Running the Project
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Testing Responsive Design
- Use browser DevTools to test different screen sizes
- Test on actual mobile devices when possible
- Check touch targets are at least 44x44px
- Verify text is readable without zooming

### Working with Mock Data
- All mock data is in `src/utils/mockData.ts`
- Services use mock responses until backend is ready
- To integrate real API, update service files and remove mock returns

### Debugging
- React DevTools extension recommended
- Check browser console for errors
- Use Tailwind CSS IntelliSense extension for better DX

---

**Built with ❤️ by the StyleFinder AI Team**

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
