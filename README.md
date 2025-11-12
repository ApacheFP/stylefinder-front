# 👗 StyleFinder AI - Frontend

StyleFinder AI is a web-based smart application designed to solve the common challenge of outfit creation and shopping indecision. The system allows users to express their needs in natural language and instantly receive curated, ready-to-buy looks assembled from live e-commerce platforms.

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icon library

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
│   └── ui/             # Base UI components (Button, Input, etc.)
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # API services and data fetching
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features (UI Implementation)

- ✅ **Landing Page** - Hero section with CTA
- ✅ **Login/Sign Up Pages** - Authentication UI (backend to implement)
- ✅ **Preferences Modal** - User preferences selection UI
- ✅ **Chat Interface** - Main chat UI with sidebar and message display
- ✅ **Product Cards** - Outfit item display cards
- ✅ **Chat History Sidebar** - Conversation history UI
- ✅ **Budget & Style Filters** - Filter controls UI
- ✅ **Mock Data** - Working with fake data until backend is ready
- 🔄 **API Layer Ready** - Services prepared for backend integration

## 🔌 Backend Integration Guide

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
