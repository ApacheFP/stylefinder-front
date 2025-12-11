import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import CallToAction from './CallToAction';

describe('CallToAction', () => {
    it('renders heading', () => {
        render(<CallToAction />);

        expect(screen.getByText('Ready to Upgrade')).toBeInTheDocument();
        expect(screen.getByText('Your Style?')).toBeInTheDocument();
    });

    it('renders description', () => {
        render(<CallToAction />);

        expect(screen.getByText(/Experience the future of personal styling/)).toBeInTheDocument();
    });

    it('renders get started link', () => {
        render(<CallToAction />);

        const link = screen.getByRole('link', { name: /Get Started/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/chat');
    });
});
