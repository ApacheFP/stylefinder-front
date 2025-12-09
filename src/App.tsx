import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const PreferencesPage = lazy(() => import('./pages/PreferencesPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HowToUsePage = lazy(() => import('./pages/HowToUsePage'));

// Loading Fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

// Wrapper for page transitions
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="w-full h-full"
  >
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  // Use a stable key for chat routes to prevent full re-mount when switching chats
  // This way /chat and /chat/:chatId share the same key and won't trigger page transitions
  const getRouteKey = (pathname: string) => {
    if (pathname.startsWith('/chat')) {
      return 'chat'; // Same key for all chat routes
    }
    return pathname;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getRouteKey(location.pathname)}>
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to="/chat" replace />
          ) : (
            <PageTransition><LandingPage /></PageTransition>
          )
        } />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
        <Route path="/preferences" element={
          <ProtectedRoute>
            <PageTransition><PreferencesPage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/chat" element={<PageTransition><ChatPage /></PageTransition>} />
        <Route path="/chat/:chatId" element={<PageTransition><ChatPage /></PageTransition>} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition><ProfilePage /></PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/how-to-use" element={<PageTransition><HowToUsePage /></PageTransition>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                reverseOrder={false}
                containerStyle={{
                  top: 80, // Avoid overlap with header
                }}
              />
              <AnimatedRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
