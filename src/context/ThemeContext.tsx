import { createContext, useContext, useLayoutEffect, useState, useCallback } from 'react';

type Theme = 'dark' | 'light';

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

interface ThemeProviderState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

// Theme transition duration (must match CSS variable)
const THEME_TRANSITION_DURATION = 400;

// Helper function to apply theme with premium transition
const applyTheme = (theme: Theme, enableTransition = true) => {
    const root = window.document.documentElement;
    
    if (enableTransition) {
        // Enable synchronized transition on all elements
        root.classList.add('theme-transitioning');
    }
    
    // Apply theme class
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    if (enableTransition) {
        // Remove transition class after animation completes
        setTimeout(() => {
            root.classList.remove('theme-transitioning');
        }, THEME_TRANSITION_DURATION);
    }
};

// Get initial theme synchronously (prevents flash)
const getInitialTheme = (storageKey: string, defaultTheme: Theme): Theme => {
    if (typeof window === 'undefined') return defaultTheme;
    
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored === 'dark' || stored === 'light') {
        return stored;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    return defaultTheme;
};

export function ThemeProvider({
    children,
    defaultTheme = 'light',
    storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const initial = getInitialTheme(storageKey, defaultTheme);
        // Apply immediately during initialization (no transition on first load)
        if (typeof window !== 'undefined') {
            applyTheme(initial, false);
        }
        return initial;
    });

    // Use useLayoutEffect to apply theme synchronously before paint
    useLayoutEffect(() => {
        // Skip on initial mount (already applied in useState)
        const root = document.documentElement;
        if (!root.classList.contains(theme)) {
            applyTheme(theme, true);
        }
    }, [theme]);

    const setTheme = useCallback((newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    }, [storageKey]);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }, [theme, setTheme]);

    const value = {
        theme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider');

    return context;
}
