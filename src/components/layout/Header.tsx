import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, User as UserIcon, Wifi, WifiOff, Server } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import api from '../../services/api';

function beautifyUsername(name: string) {
  const lower = name.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

type ServerStatus = 'checking' | 'online' | 'offline';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>('checking');
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  let userName = user?.name || ""
  userName = beautifyUsername(userName)

  const isDev = import.meta.env.DEV;

  // Check server status
  useEffect(() => {
    if (!isDev) return;

    const checkServerStatus = async () => {
      try {
        await api.get('/health', { timeout: 5000 });
        setServerStatus('online');
      } catch {
        try {
          await api.get('/conversations', { timeout: 5000 });
          setServerStatus('online');
        } catch {
          setServerStatus('offline');
        }
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, [isDev]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:border-gray-800 border-b border-border px-4 md:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-lg md:text-xl lg:text-[22px] font-roboto font-bold text-text-dark dark:text-white hover:text-primary transition-colors">
          StyleFinder AI
        </h1>
      </Link>

      {/* Server Status Indicator - Center (Dev Only) */}
      {isDev && (
        <div className="hidden sm:flex items-center gap-2">
          {serverStatus === 'checking' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700">
              <Server className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              <span className="text-[11px] font-medium text-yellow-600 dark:text-yellow-400">Backend Server: Checking...</span>
            </div>
          )}
          {serverStatus === 'online' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700">
              <Wifi className="w-3.5 h-3.5 text-green-500" />
              <span className="text-[11px] font-medium text-green-600 dark:text-green-400">Backend Server: Online</span>
            </div>
          )}
          {serverStatus === 'offline' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700">
              <WifiOff className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[11px] font-medium text-red-600 dark:text-red-400">Backend Server: Offline</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle size="sm" />

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            >
              <span className="hidden sm:block text-sm font-inter text-text-medium dark:text-white">
                {userName}
              </span>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold font-inter cursor-pointer hover:bg-blue-600 transition-colors">
                {userName?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 md:w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-border dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 md:py-3 border-b border-border dark:border-gray-700">
                  <p className="text-sm font-roboto font-bold text-text-dark dark:text-white">{userName}</p>
                  <p className="text-xs font-inter text-text-light dark:text-gray-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/preferences"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4 text-text-medium dark:text-gray-400" />
                  <span className="text-sm font-inter text-text-dark dark:text-gray-200">Preferences</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-text-medium dark:text-gray-400" />
                  <span className="text-sm font-inter text-text-dark dark:text-gray-200">Profile</span>
                </Link>

                <div className="border-t border-border dark:border-gray-700 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-inter text-red-500">Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs md:text-sm px-3 md:px-4 border border-gray-200 dark:border-gray-700">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" className="text-xs md:text-sm px-3 md:px-4">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
