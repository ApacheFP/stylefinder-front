# 🗄️ Supabase Setup Guide for StyleFinder AI

This guide will walk you through setting up Supabase as the backend for StyleFinder AI, including database schema, authentication, storage, and edge functions.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Schema](#database-schema)
4. [Storage Setup](#storage-setup)
5. [Authentication Configuration](#authentication-configuration)
6. [Edge Functions](#edge-functions)
7. [Frontend Integration](#frontend-integration)
8. [Testing](#testing)
9. [Deployment](#deployment)

---

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Basic understanding of PostgreSQL and SQL

---

## Project Setup

### 1. Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Create or select existing
   - **Project Name**: `stylefinder-ai`
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** (takes ~2 minutes)

### 2. Get API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Add to `.env` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. Create Supabase Client

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Database Schema

### Setup Instructions

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the schema below
4. Click **Run** to execute

### Complete Schema

```sql
-- ==================================================
-- STYLEFINDER AI DATABASE SCHEMA
-- ==================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================================================
-- 1. PROFILES TABLE
-- ==================================================
-- Extends Supabase auth.users with additional user info
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- 2. USER PREFERENCES TABLE
-- ==================================================
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  styles TEXT[] DEFAULT '{}',
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 1000,
  favorite_colors TEXT[] DEFAULT '{}',
  size_top TEXT,
  size_bottom TEXT,
  size_shoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- 3. CHATS TABLE
-- ==================================================
CREATE TABLE chats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE TRIGGER chats_updated_at
BEFORE UPDATE ON chats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Index for faster queries
CREATE INDEX chats_user_id_idx ON chats(user_id);
CREATE INDEX chats_updated_at_idx ON chats(updated_at DESC);

-- ==================================================
-- 4. MESSAGES TABLE
-- ==================================================
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Indexes
CREATE INDEX messages_chat_id_idx ON messages(chat_id);
CREATE INDEX messages_created_at_idx ON messages(created_at);

-- ==================================================
-- 5. OUTFITS TABLE
-- ==================================================
CREATE TABLE outfits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  style TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;

-- RLS Policy
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

CREATE POLICY "System can insert outfits"
  ON outfits FOR INSERT
  WITH CHECK (true); -- Edge functions will insert

-- Index
CREATE INDEX outfits_message_id_idx ON outfits(message_id);

-- ==================================================
-- 6. OUTFIT ITEMS TABLE
-- ==================================================
CREATE TABLE outfit_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  outfit_id UUID REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  product_link TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('top', 'bottom', 'shoes', 'accessories')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy
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

CREATE POLICY "System can insert outfit items"
  ON outfit_items FOR INSERT
  WITH CHECK (true); -- Edge functions will insert

-- Index
CREATE INDEX outfit_items_outfit_id_idx ON outfit_items(outfit_id);

-- ==================================================
-- 7. CHAT FILTERS TABLE
-- ==================================================
CREATE TABLE chat_filters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  budget_max INTEGER,
  outfit_type TEXT CHECK (outfit_type IN ('complete', 'partial')),
  selected_items TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chat_id)
);

ALTER TABLE chat_filters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE TRIGGER chat_filters_updated_at
BEFORE UPDATE ON chat_filters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================================================
-- 8. FUNCTIONS
-- ==================================================

-- Function to get chat with message count and last message
CREATE OR REPLACE FUNCTION get_chat_list(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  message_count BIGINT,
  last_message TEXT,
  last_message_time TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    COUNT(m.id) as message_count,
    (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
    (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
  FROM chats c
  LEFT JOIN messages m ON m.chat_id = c.id
  WHERE c.user_id = user_uuid
  GROUP BY c.id
  ORDER BY c.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- COMPLETED! 🎉
-- ==================================================
-- Your database is now set up and ready to use.
-- Next steps:
-- 1. Set up Storage buckets
-- 2. Configure Authentication
-- 3. Deploy Edge Functions
```

---

## Storage Setup

### 1. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **"New bucket"**
3. Create bucket:
   - **Name**: `chat-images`
   - **Public bucket**: ✅ Yes (for easy image access)
4. Click **Create bucket**

### 2. Set Storage Policies

Go to **Storage** → **Policies** → **chat-images** and add:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-images' AND
  auth.role() = 'authenticated'
);

-- Allow public read access
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images');

-- Allow users to delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Usage in Frontend

```typescript
// Upload image
export async function uploadChatImage(file: File): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}
```

---

## Authentication Configuration

### 1. Email/Password Setup (Default)

Already enabled by default! No additional setup needed.

### 2. Optional: Email Templates

Customize email templates in **Authentication** → **Email Templates**:

- **Confirm signup**: Welcome email with confirmation link
- **Invite user**: Invitation email
- **Magic Link**: Passwordless login
- **Change Email Address**: Confirm new email
- **Reset Password**: Password reset link

### 3. Optional: OAuth Providers

To enable Google/GitHub/etc login:

1. Go to **Authentication** → **Providers**
2. Enable desired provider (e.g., Google)
3. Add OAuth credentials from provider
4. Update frontend auth flow

---

## Edge Functions

Edge Functions handle AI integration and outfit generation.

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Edge Functions

```bash
supabase init
supabase functions new generate-outfit
```

### 3. Create Edge Function

File: `supabase/functions/generate-outfit/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Parse request
    const { chatId, message, imageData } = await req.json();

    // 1. Get user preferences
    const { data: preferences } = await supabaseClient
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // 2. Call OpenAI/Claude API (your AI integration here)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a fashion stylist. Help users find outfits based on their preferences: ${JSON.stringify(preferences)}`
          },
          { role: 'user', content: message }
        ]
      })
    });

    const aiResponse = await openaiResponse.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // 3. Fetch products from e-commerce APIs (Zalando, ASOS, etc.)
    // Implementation depends on your product data source
    const products = await fetchProducts(message, preferences);

    // 4. Create outfits
    const outfits = generateOutfitsFromProducts(products);

    // 5. Insert assistant message
    const { data: newMessage } = await supabaseClient
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role: 'assistant',
        content: assistantMessage
      })
      .select()
      .single();

    // 6. Insert outfits and items
    for (const outfit of outfits) {
      const { data: outfitRecord } = await supabaseClient
        .from('outfits')
        .insert({
          message_id: newMessage.id,
          style: outfit.style,
          total_price: outfit.totalPrice
        })
        .select()
        .single();

      await supabaseClient
        .from('outfit_items')
        .insert(
          outfit.items.map(item => ({
            outfit_id: outfitRecord.id,
            name: item.name,
            brand: item.brand,
            price: item.price,
            image_url: item.imageUrl,
            product_link: item.link,
            category: item.category
          }))
        );
    }

    return new Response(
      JSON.stringify({ success: true, message: newMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper functions
async function fetchProducts(query: string, preferences: any) {
  // Implement product fetching from e-commerce APIs
  return [];
}

function generateOutfitsFromProducts(products: any[]) {
  // Implement outfit generation logic
  return [];
}
```

### 4. Deploy Edge Function

```bash
supabase functions deploy generate-outfit --no-verify-jwt
```

### 5. Set Environment Variables

```bash
supabase secrets set OPENAI_API_KEY=your-openai-key
```

---

## Frontend Integration

### 1. Update AuthContext

See complete example in `README.md` → Supabase section

### 2. Update Service Files

Replace mock data with real Supabase queries:

**Example: `src/services/chatService.ts`**

```typescript
import { supabase } from '../lib/supabase';

export const chatService = {
  async getChatHistory() {
    const { data, error } = await supabase
      .rpc('get_chat_list', { user_uuid: (await supabase.auth.getUser()).data.user?.id });
    
    if (error) throw error;
    return data;
  },
  
  async sendMessage(chatId: string, content: string, imageData?: string) {
    // Call edge function
    const { data, error } = await supabase.functions.invoke('generate-outfit', {
      body: { chatId, message: content, imageData }
    });
    
    if (error) throw error;
    return data;
  }
};
```

### 3. Enable Real-time

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`chat:${chatId}`)
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [chatId]);
```

---

## Testing

### 1. Test Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'testpass123',
  options: { data: { name: 'Test User' } }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'testpass123'
});

// Sign out
await supabase.auth.signOut();
```

### 2. Test Database Operations

```typescript
// Insert preferences
await supabase.from('user_preferences').insert({
  user_id: user.id,
  styles: ['casual', 'elegant'],
  budget_min: 50,
  budget_max: 200
});

// Create chat
const { data: chat } = await supabase
  .from('chats')
  .insert({ user_id: user.id, title: 'Test Chat' })
  .select()
  .single();

// Send message
await supabase.from('messages').insert({
  chat_id: chat.id,
  user_id: user.id,
  role: 'user',
  content: 'Show me casual outfits'
});
```

### 3. Test Storage

```typescript
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
await supabase.storage.from('chat-images').upload(`test/${Date.now()}.jpg`, file);
```

---

## Deployment

### 1. Environment Variables

Add to your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Production Build

```bash
npm run build
```

### 3. Deploy

Deploy `dist/` folder to your hosting service.

### 4. Configure CORS

In Supabase dashboard:
- **Settings** → **API** → **API Settings**
- Add your production domain to allowed origins

---

## 🎉 Done!

Your StyleFinder AI app is now fully integrated with Supabase!

### Next Steps:
1. ✅ Implement AI integration in Edge Functions
2. ✅ Connect to e-commerce APIs for product data
3. ✅ Add caching for better performance
4. ✅ Set up monitoring and error tracking
5. ✅ Test thoroughly across all features

### Resources:
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Need help?** Check `README.md` for additional documentation or contact the team.
