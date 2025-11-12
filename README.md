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

## 🔌 Backend Integration

This is a **frontend-only implementation**. The backend is being developed by the backend team.

**What's ready for backend:**
- Service layer in `src/services/` with API endpoints structure
- TypeScript interfaces in `src/types/` for request/response models
- Mock data in `src/utils/mockData.ts` (to be replaced with real API calls)
- Axios instance configured in `src/services/api.ts`

**To integrate with backend:**
1. Update `VITE_API_BASE_URL` in `.env` with your backend URL
2. Replace mock responses in services with real API calls
3. Authentication token handling is already implemented

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
