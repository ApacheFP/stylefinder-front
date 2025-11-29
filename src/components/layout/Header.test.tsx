/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

import { useTheme } from '../../context/ThemeContext';

// Mock useAuth
vi.mock('../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

// Mock useTheme
vi.mock('../../context/ThemeContext', () => ({
    useTheme: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useTheme as any).mockReturnValue({ theme: 'light', setTheme: vi.fn() });
    });

    it('renders correctly', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { name: 'Test User' } });
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        expect(screen.getByText('StyleFinder AI')).toBeInTheDocument();
    });

    it('navigates to profile on click', () => {
        (useAuth as any).mockReturnValue({ isAuthenticated: true, user: { name: 'Test User' } });
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        // Open user menu
        const avatar = screen.getByText('T'); // First letter of Test User
        fireEvent.click(avatar);

        // Click Profile link
        const profileLink = screen.getByText('Profile');
        fireEvent.click(profileLink);

        // Since it's a Link, we can check if it rendered with correct href, 
        // or rely on integration. But Link doesn't call navigate directly unless we mock it to.
        // However, we can check if the menu closes?
        // Or just check presence of links.
        expect(profileLink.closest('a')).toHaveAttribute('href', '/profile');
    });
});
