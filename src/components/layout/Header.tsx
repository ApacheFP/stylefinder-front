import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

function beautifyUsername(name: string) {
  const lower = name.trim().toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

interface HeaderProps {
  chatTitle?: string;
}

const Header = ({ chatTitle }: HeaderProps) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  let userName = user?.name || ""
  userName = beautifyUsername(userName)

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
    <header className="relative bg-cream-100 dark:bg-surface-dark dark:border-surface-muted border-b border-cream-300 px-4 md:px-6 lg:px-8 py-3 md:py-4 flex justify-between items-center">
      <Link to="/">
        <h1 className="text-lg md:text-xl lg:text-[22px] font-roboto font-bold text-text-dark dark:text-white hover:text-primary transition-colors">
          StyleFinder AI
        </h1>
      </Link>

      {/* Centered Chat Title */}
      {chatTitle && (
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-1.5 bg-cream-200/60 dark:bg-surface-muted/60 backdrop-blur-sm rounded-full border border-cream-300 dark:border-surface-muted">
            <span className="text-sm font-medium text-text-dark dark:text-stone-200">
              {chatTitle}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle size="sm" />

        {isAuthenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold font-inter cursor-pointer hover:bg-primary-hover transition-colors">
                {userName?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 md:w-56 bg-cream-100 dark:bg-surface-darker rounded-xl shadow-lg border border-cream-300 dark:border-surface-muted py-2 z-50">
                <div className="px-4 py-2 md:py-3 border-b border-cream-300 dark:border-surface-muted">
                  <p className="text-sm font-roboto font-bold text-text-dark dark:text-white">{userName}</p>
                  <p className="text-xs font-inter text-text-light dark:text-stone-400 truncate">{user?.email}</p>
                </div>

                <Link
                  to="/preferences"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cream-200 dark:hover:bg-surface-muted transition-colors"
                >
                  <Settings className="w-4 h-4 text-text-medium dark:text-stone-400" />
                  <span className="text-sm font-inter text-text-dark dark:text-stone-200">Preferences</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cream-200 dark:hover:bg-surface-muted transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-text-medium dark:text-stone-400" />
                  <span className="text-sm font-inter text-text-dark dark:text-stone-200">Profile</span>
                </Link>

                <div className="border-t border-border dark:border-surface-muted my-2"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cream-200 dark:hover:bg-surface-muted transition-colors w-full text-left"
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
              <Button variant="ghost" size="sm" className="text-xs md:text-sm px-3 md:px-4 border border-stone-200 dark:border-surface-muted">Log In</Button>
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
