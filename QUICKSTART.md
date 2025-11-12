# 🚀 Quick Start Guide - StyleFinder AI

Get StyleFinder AI up and running in 5 minutes!

## ⚡ Prerequisites

- **Node.js 18+** and npm installed
- **Git** installed
- Code editor (VS Code recommended)

## 📥 Step 1: Clone & Install

```bash
# Navigate to project folder
cd stylefinder-front

# Install dependencies
npm install
```

## 🔧 Step 2: Environment Setup

```bash
# Create .env file
cp .env.example .env
```

**For development** (mock data mode), the default `.env` is fine. No changes needed!

## 🎨 Step 3: Start Development Server

```bash
npm run dev
```

🎉 **Done!** Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎯 What You'll See

### Landing Page (/)
- Hero section with "Get Started Free" button
- Click it to go to chat

### Chat Page (/chat)
- **Mock Auto-Login**: You're automatically logged in as "John Doe" in development mode
- Try sending messages like:
  - "Show me casual outfits for summer"
  - "I need formal business attire"
  - "Sporty outfit for the gym"
- Upload images via drag & drop or paperclip icon
- Click "Explain this outfit" on any recommendation
- Use filters (Budget Max, Outfit Type)
- Create new chats with "New Chat" button

### Try Other Pages
- **/login** - Login UI (mock, no real auth yet)
- **/signup** - Sign up UI (mock)
- **/preferences** - User preferences selection

---

## 🛠️ Available Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint -- --fix  # Fix linting issues
```

---

## 📱 Test Responsive Design

1. Open browser DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl/Cmd + Shift + M)
3. Try different devices:
   - **iPhone SE** (375px) - Mobile view
   - **iPad** (768px) - Tablet view
   - **Laptop** (1024px+) - Desktop view

**What to look for:**
- Mobile: Hamburger menu, stacked layout
- Tablet: Two-column product grid
- Desktop: Full sidebar, three-column grid

---

## 🔌 Backend Integration Options

### Option 1: Supabase (Recommended) 🗄️

**Quick Start:**
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Get credentials from Settings → API
4. Update `.env`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
5. Follow **SUPABASE_SETUP.md** for complete setup

**Migration:**
- See **MIGRATION_GUIDE.md** for step-by-step migration from mock data to Supabase

### Option 2: Custom Backend API 🔌

1. Backend team implements endpoints from **BACKEND_INTEGRATION.md**
2. Update `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
```
3. Replace mock data in service files

---

## 📂 Project Structure

```
stylefinder-front/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/      # Header, Sidebar
│   │   ├── ui/          # Button, Input, ProductCard, etc.
│   │   └── chat/        # Chat-specific components
│   ├── pages/           # Page components (Landing, Chat, etc.)
│   ├── services/        # API services (mock data currently)
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context (AuthContext)
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions (mockData, animations, etc.)
├── public/              # Static assets
└── docs/                # Documentation files
```

---

## 🎨 Key Features

✅ **Fully Responsive** - Mobile, tablet, desktop optimized
✅ **Modern UI/UX** - Smooth animations, loading states, toast notifications
✅ **Image Upload** - Drag & drop or file picker
✅ **Chat Interface** - AI-powered outfit recommendations (UI ready)
✅ **Filters** - Budget and outfit type controls
✅ **Chat History** - Multiple conversations with sidebar
✅ **Product Cards** - Beautiful outfit display
✅ **Mock Data** - Works without backend for development

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Change port in package.json or kill process on 5173
lsof -ti:5173 | xargs kill
```

### Dependencies won't install
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styles not loading
```bash
# Rebuild Tailwind
npm run dev -- --force
```

### Images not displaying
- Check that image URLs are valid
- For local images, place in `public/` folder
- Reference as `/image.jpg` (not `./public/image.jpg`)

---

## 📚 Next Steps

### For Frontend Development
1. ✅ You're all set! Start customizing UI/UX
2. 📖 Check **DEVELOPMENT_NOTES.md** for design decisions
3. 🎨 Modify colors in `tailwind.config.js`
4. 🧩 Add new components in `src/components/`

### For Backend Integration
1. 📘 Read **SUPABASE_SETUP.md** (recommended) or **BACKEND_INTEGRATION.md**
2. 🗄️ Set up database (Supabase or custom)
3. 🔌 Implement API endpoints
4. 🔄 Follow **MIGRATION_GUIDE.md** to replace mock data
5. 🧪 Test integration thoroughly

### For Deployment
1. 🏗️ Build: `npm run build`
2. 🌐 Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - AWS Amplify
   - Any static hosting
3. 🔐 Add environment variables in hosting dashboard
4. ✅ Test in production

---

## 🤝 Need Help?

### Documentation
- **README.md** - Complete project overview
- **SUPABASE_SETUP.md** - Supabase configuration
- **MIGRATION_GUIDE.md** - Backend migration
- **RESPONSIVE_COMPLETE.md** - Responsive design details
- **BACKEND_INTEGRATION.md** - Custom API integration

### Common Questions

**Q: How do I change colors?**
A: Edit `tailwind.config.js` → `theme.extend.colors`

**Q: Where is the mock data?**
A: `src/utils/mockData.ts`

**Q: How do I add a new page?**
A: 
1. Create in `src/pages/MyPage.tsx`
2. Add route in `src/App.tsx`

**Q: Can I use this without backend?**
A: Yes! It works fully with mock data for UI development

**Q: Which backend should I use?**
A: **Supabase** is recommended (easier, faster setup). Custom API if you need more control.

---

## 🎉 You're Ready!

The app should now be running at **http://localhost:5173**

**Happy coding! 💻✨**

---

### Quick Tips 💡

- Use **React DevTools** extension for debugging
- Use **Tailwind CSS IntelliSense** VS Code extension
- Press `Ctrl/Cmd + Shift + P` → "Reload Window" if hot reload breaks
- Check browser console for any errors
- All components are TypeScript - leverage autocomplete!

---

**Questions?** Open an issue or check the documentation files! 🚀
