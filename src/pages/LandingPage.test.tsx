/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
}));

// Mock ParticleBackground
vi.mock('../components/ui/ParticleBackground', () => ({
    default: () => <div data-testid="particle-background" />,
}));

vi.mock('../components/ui/Button', () => ({
    default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock useAuth
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        isLoading: false,
        user: null,
    }),
}));

describe('LandingPage', () => {
    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('StyleFinder AI')).toBeInTheDocument();
        expect(screen.getByText(/Find Your Perfect Outfit/)).toBeInTheDocument();
        expect(screen.getByText(/in Seconds/)).toBeInTheDocument();
        expect(screen.getByText(/Tell us what you need/)).toBeInTheDocument();
    });

    it('renders login button', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        const loginLink = screen.getByRole('link', { name: /Log In \/ Sign Up/i });
        expect(loginLink).toBeInTheDocument();
        expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders get started button', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        const getStartedLink = screen.getByRole('link', { name: /Get Started/i });
        expect(getStartedLink).toBeInTheDocument();
        expect(getStartedLink).toHaveAttribute('href', '/chat');
    });

    it('renders feature sections', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByText('Natural Language')).toBeInTheDocument();
        expect(screen.getByText('AI-Powered')).toBeInTheDocument();
        expect(screen.getByText('Personalized')).toBeInTheDocument();
    });

    it('renders particle background', () => {
        render(
            <BrowserRouter>
                <LandingPage />
            </BrowserRouter>
        );

        expect(screen.getByTestId('particle-background')).toBeInTheDocument();
    });
});
