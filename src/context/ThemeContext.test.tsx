import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
    const { theme, setTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={() => setTheme('dark')}>Set Dark</button>
            <button onClick={() => setTheme('light')}>Set Light</button>
        </div>
    );
};

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.className = '';
    });

    it('provides default theme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });

    it('loads theme from local storage', () => {
        localStorage.setItem('vite-ui-theme', 'dark');
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });

    it('updates theme and local storage', async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        await user.click(screen.getByText('Set Dark'));

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
        expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('toggles back to light theme', async () => {
        const user = userEvent.setup();
        render(
            <ThemeProvider defaultTheme="dark">
                <TestComponent />
            </ThemeProvider>
        );

        await user.click(screen.getByText('Set Light'));

        expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
        expect(localStorage.getItem('vite-ui-theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('uses custom storage key', () => {
        localStorage.setItem('custom-key', 'dark');
        render(
            <ThemeProvider storageKey="custom-key">
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });
    it('throws error when used outside provider', () => {
        // Suppress console.error as React logs errors when boundary catches or render fails
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider');

        consoleSpy.mockRestore();
    });
});
