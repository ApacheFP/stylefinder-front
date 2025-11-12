# 🔄 Migration Guide: Mock Data → Supabase

This guide explains how to migrate from mock data to a fully functional Supabase backend.

## 📋 Overview

The StyleFinder AI frontend is currently using mock data in `src/utils/mockData.ts`. This guide will help you replace all mock implementations with real Supabase queries.

---

## 🎯 Migration Checklist

- [ ] **Setup Supabase project** (see `SUPABASE_SETUP.md`)
- [ ] **Create database schema**
- [ ] **Configure storage buckets**
- [ ] **Update AuthContext**
- [ ] **Replace authService**
- [ ] **Replace chatService**
- [ ] **Replace preferencesService**
- [ ] **Test all features**
- [ ] **Remove mock data**
- [ ] **Deploy to production**

---

## 📂 Files to Update

### 1. Create Supabase Client

**New file**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

### 2. Update AuthContext

**File**: `src/context/AuthContext.tsx`

**Before (Mock):**
```typescript
const login = async (email: string, password: string) => {
  // Mock implementation
  setUser({ id: '1', email, name: 'John Doe' });
  localStorage.setItem('token', 'mock-token');
};
```

**After (Supabase):**
```typescript
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  setUser(data.user);
};

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

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  setUser(null);
};

// Listen to auth changes
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
    setLoading(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}, []);
```

---

### 3. Update authService

**File**: `src/services/authService.ts`

**Before (Mock):**
```typescript
export const authService = {
  async login(email: string, password: string) {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      token: 'mock-token',
      user: { id: '1', email, name: 'John Doe' }
    };
  }
};
```

**After (Supabase):**
```typescript
import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) throw error;

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name
      });
    }

    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }
};
```

---

### 4. Update preferencesService

**File**: `src/services/preferencesService.ts`

**Before (Mock):**
```typescript
export const preferencesService = {
  async getPreferences() {
    return mockPreferences;
  },

  async savePreferences(preferences: UserPreferences) {
    // Mock save
    return { success: true };
  }
};
```

**After (Supabase):**
```typescript
import { supabase } from '../lib/supabase';
import type { UserPreferences } from '../types';

export const preferencesService = {
  async getPreferences(): Promise<UserPreferences | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    
    if (!data) return null;

    return {
      styles: data.styles,
      budget: {
        min: data.budget_min,
        max: data.budget_max
      },
      favoriteColors: data.favorite_colors,
      sizes: {
        top: data.size_top,
        bottom: data.size_bottom,
        shoes: data.size_shoes
      }
    };
  },

  async savePreferences(preferences: UserPreferences) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        styles: preferences.styles,
        budget_min: preferences.budget.min,
        budget_max: preferences.budget.max,
        favorite_colors: preferences.favoriteColors,
        size_top: preferences.sizes?.top,
        size_bottom: preferences.sizes?.bottom,
        size_shoes: preferences.sizes?.shoes
      });

    if (error) throw error;
    return { success: true };
  }
};
```

---

### 5. Update chatService

**File**: `src/services/chatService.ts`

**Before (Mock):**
```typescript
export const chatService = {
  async getChatHistory() {
    return mockChats;
  },

  async sendMessage(chatId: string, message: string) {
    // Mock response
    return {
      id: 'msg-' + Date.now(),
      content: 'Mock response',
      role: 'assistant',
      outfits: mockOutfits
    };
  }
};
```

**After (Supabase):**
```typescript
import { supabase } from '../lib/supabase';
import type { Chat, Message, Outfit } from '../types';

export const chatService = {
  async getChatHistory(): Promise<Chat[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('get_chat_list', { user_uuid: user.id });

    if (error) throw error;

    return data.map(chat => ({
      id: chat.id,
      title: chat.title,
      lastMessage: chat.last_message || '',
      timestamp: new Date(chat.last_message_time || chat.created_at),
      messageCount: chat.message_count
    }));
  },

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

    return data.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at),
      imageUrl: msg.image_url,
      outfits: msg.outfits?.map((outfit: any) => ({
        id: outfit.id,
        style: outfit.style,
        totalPrice: parseFloat(outfit.total_price),
        explanation: outfit.explanation,
        items: outfit.outfit_items.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: parseFloat(item.price),
          imageUrl: item.image_url,
          link: item.product_link,
          category: item.category
        }))
      }))
    }));
  },

  async sendMessage(chatId: string, content: string, imageData?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Insert user message
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

    // Call edge function to generate AI response
    const { data, error } = await supabase.functions.invoke('generate-outfit', {
      body: { chatId, message: content, imageData }
    });

    if (error) throw error;
    return data;
  },

  async saveFilters(chatId: string, filters: ChatFilters) {
    const { error } = await supabase
      .from('chat_filters')
      .upsert({
        chat_id: chatId,
        budget_max: filters.budgetMax,
        outfit_type: filters.outfitType,
        selected_items: filters.selectedItems
      });

    if (error) throw error;
  },

  async getFilters(chatId: string): Promise<ChatFilters | null> {
    const { data, error } = await supabase
      .from('chat_filters')
      .select('*')
      .eq('chat_id', chatId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    return {
      budgetMax: data.budget_max,
      outfitType: data.outfit_type,
      selectedItems: data.selected_items
    };
  },

  async deleteChat(chatId: string) {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId);

    if (error) throw error;
  }
};
```

---

### 6. Add Image Upload Service

**New file**: `src/services/storageService.ts`

```typescript
import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadChatImage(file: File): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, and WebP images are allowed');
    }

    // Upload
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('chat-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data } = supabase.storage
      .from('chat-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  async deleteChatImage(url: string) {
    // Extract path from URL
    const path = url.split('/storage/v1/object/public/chat-images/')[1];
    if (!path) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from('chat-images')
      .remove([path]);

    if (error) throw error;
  }
};
```

---

### 7. Update Image Upload Hook

**File**: `src/hooks/useImageUpload.ts`

**Update to use `storageService`:**

```typescript
import { useState } from 'react';
import { storageService } from '../services/storageService';
import { showErrorToast } from '../utils/toast';

export function useImageUpload() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const url = await storageService.uploadChatImage(file);
      setUploadedImage(url);
      return url;
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to upload image');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  return {
    uploadedImage,
    uploadImage,
    removeImage,
    isUploading
  };
}
```

---

### 8. Add Real-time Subscriptions

**File**: `src/pages/ChatPage.tsx`

**Add after existing useEffect:**

```typescript
// Real-time subscription for new messages
useEffect(() => {
  if (!currentChatId) return;

  const channel = supabase
    .channel(`chat:${currentChatId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${currentChatId}`
      },
      async (payload) => {
        // Fetch full message with outfits
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            outfits (
              *,
              outfit_items (*)
            )
          `)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          setMessages(prev => [...prev, transformMessage(data)]);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [currentChatId]);
```

---

## 🧪 Testing Checklist

After migration, test these features:

### Authentication
- [ ] Sign up with email/password
- [ ] Sign in with email/password
- [ ] Sign out
- [ ] Protected routes redirect correctly
- [ ] User session persists after page reload

### Preferences
- [ ] Save user preferences
- [ ] Load preferences on login
- [ ] Update preferences

### Chat
- [ ] Create new chat
- [ ] Load chat history
- [ ] Send message
- [ ] Receive AI response with outfits
- [ ] Real-time message updates
- [ ] Upload images
- [ ] Save/load chat filters

### Storage
- [ ] Upload images (< 5MB, valid format)
- [ ] Display uploaded images
- [ ] Delete images
- [ ] Error handling for invalid files

---

## 🗑️ Cleanup

After successful migration and testing:

### 1. Remove Mock Data

**Delete or comment out** `src/utils/mockData.ts`:

```typescript
// This file is no longer used - all data comes from Supabase
// Keep for reference during development if needed
```

### 2. Remove Mock Axios Instance

**File**: `src/services/api.ts`

```typescript
// Remove axios configuration if only using Supabase
// Keep if you have other REST APIs to call
```

### 3. Update Environment Variables

Remove `VITE_API_BASE_URL` from `.env` if not needed:

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚀 Deployment

### 1. Vercel

```bash
npm run build
vercel --prod
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2. Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Add environment variables in Netlify dashboard.

### 3. Other Platforms

Build and deploy `dist/` folder with environment variables configured.

---

## 🐛 Common Issues

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env` file exists with correct variables and restart dev server.

### Issue: "Not authenticated" errors
**Solution**: Check that user is logged in and session is valid. Use `supabase.auth.getUser()` to verify.

### Issue: "Permission denied" in database
**Solution**: Check Row Level Security policies in Supabase dashboard. Ensure policies allow the operation.

### Issue: Real-time not working
**Solution**: 
1. Check that Realtime is enabled in Supabase settings
2. Verify channel subscription is created correctly
3. Check browser console for errors

### Issue: Images not uploading
**Solution**:
1. Verify storage bucket `chat-images` exists
2. Check storage policies allow insert
3. Verify file size and format are valid

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Detailed setup guide
- [README.md](./README.md) - Complete project documentation
- [Supabase Discord](https://discord.supabase.com) - Community support

---

**Need help?** Refer to `SUPABASE_SETUP.md` for detailed Supabase configuration or contact the team.

**Good luck with your migration! 🚀**
