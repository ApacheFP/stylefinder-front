import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, User as UserIcon, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';
import Tooltip from '../ui/Tooltip';

function beutifyUsername(name: string) {
  return name.trim().toLowerCase().charAt(0).toUpperCase() + name.slice(1)
}

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  let userName = user?.name || ""
  userName = beutifyUsername(userName)

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

      <div className="flex items-center gap-2 md:gap-4">
        <Tooltip content={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'} position="bottom">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={`Toggle theme (currently ${theme})`}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </Tooltip>

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
