/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import HeroSection from './HeroSection';

// Mock ThemeToggle to avoid useTheme dependency issues
vi.mock('../ui/ThemeToggle', () => ({
    default: () => <div data-testid="theme-toggle" />,
}));

describe('HeroSection', () => {
    it('renders hero content', () => {
        render(<HeroSection />);

        expect(screen.getByText('Curated Style,')).toBeInTheDocument();
        expect(screen.getByText('Instantly.')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<HeroSection />);

        expect(screen.getByRole('link', { name: /Log In/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Sign Up/i })).toBeInTheDocument();
    });

    it('renders get started button', () => {
        render(<HeroSection />);

        expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument();
    });

    it('renders StyleFinder logo', () => {
        render(<HeroSection />);

        expect(screen.getByText('StyleFinder')).toBeInTheDocument();
    });

    it('renders theme toggle', () => {
        render(<HeroSection />);

        expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
});
