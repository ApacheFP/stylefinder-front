import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import Footer from './Footer';

describe('Footer', () => {
    it('renders StyleFinder logo and name', () => {
        render(<Footer />);

        expect(screen.getByText('StyleFinder')).toBeInTheDocument();
    });

    it('renders copyright', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`© ${currentYear} StyleFinder AI`)).toBeInTheDocument();
    });

    it('renders made with love message', () => {
        render(<Footer />);

        expect(screen.getByText(/Made with/)).toBeInTheDocument();
        expect(screen.getByText(/StyleFinder Team/)).toBeInTheDocument();
    });

    it('renders logo link', () => {
        render(<Footer />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');
    });
});
