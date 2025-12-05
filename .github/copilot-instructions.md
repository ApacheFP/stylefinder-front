# StyleFinder AI - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
StyleFinder AI is a web-based smart application designed to solve the common challenge of outfit creation and shopping indecision. The system allows users to express their needs in natural language and instantly receive curated, ready-to-buy looks assembled from live e-commerce platforms.

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: Context API + React hooks

## Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Header, etc.)
│   └── ui/             # Base UI components (Button, Input, etc.)
├── pages/              # Page components
├── context/            # React Context providers
├── services/           # API services and data fetching
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Coding Guidelines
1. **TypeScript**: Use TypeScript for all files. Define proper interfaces and types.
2. **Components**: Use functional components with hooks.
3. **Styling**: Use Tailwind CSS utility classes. Avoid inline styles.
4. **Naming**: 
   - Components: PascalCase (e.g., `UserProfile.tsx`)
   - Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
   - Utils: camelCase (e.g., `formatDate.ts`)
5. **Imports**: Use absolute imports from `src/`
6. **API**: Prepare for future API integration. All API calls should go through services layer.

## Design System (From Figma)
- **Primary Color**: Ochre Gold (#C9A227)
- **Text Colors**: 
  - Dark: #212529
  - Medium: #495057
  - Light: #ADB5BD
- **Background**: #F4F7F6
- **Borders**: #E5E7EB
- **Fonts**: Roboto (headings), Inter (body text)
- **Border Radius**: 20px for inputs, 12px for cards, 8px for buttons
- **Layout**: Clean, modern, minimalist (based on Figma mockup)
- **Responsive**: Mobile-first approach

## Frontend-Only Implementation
- **Mock Data**: Use mock data in `src/utils/mockData.ts` for development
- **API Layer**: Services are prepared but use mock responses until backend is ready
- **No Backend Logic**: Focus only on UI/UX implementation
- **Backend Integration**: Will be done by backend team later

## Features (UI Only)
- User authentication pages (Login/Sign Up UI)
- User preferences modal UI
- AI-powered chat interface UI
- Outfit recommendations display with product cards
- Chat history sidebar
- Budget and style filters UI
