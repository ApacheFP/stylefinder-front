import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PreferencesPage from './pages/PreferencesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

// Wrapper for page transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
        <Route path="/preferences" element={<PageTransition><PreferencesPage /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><ChatPage /></PageTransition>} />
        <Route path="/chat/:chatId" element={<PageTransition><ChatPage /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" reverseOrder={false} />
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
