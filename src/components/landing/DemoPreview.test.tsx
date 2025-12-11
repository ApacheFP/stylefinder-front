import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import DemoPreview from './DemoPreview';

describe('DemoPreview', () => {
    it('renders section heading', () => {
        render(<DemoPreview />);

        expect(screen.getByText('See It In Action')).toBeInTheDocument();
        expect(screen.getByText('Awaits')).toBeInTheDocument();
    });

    it('renders demo chat interface', () => {
        render(<DemoPreview />);

        expect(screen.getByText('StyleFinder AI')).toBeInTheDocument();
        expect(screen.getByText(/elegant outfit for a summer wedding/)).toBeInTheDocument();
    });

    it('renders mock products', () => {
        render(<DemoPreview />);

        expect(screen.getByText('ZARA')).toBeInTheDocument();
        expect(screen.getByText('Mango')).toBeInTheDocument();
        expect(screen.getByText('H&M')).toBeInTheDocument();
    });

    it('renders try it yourself button', () => {
        render(<DemoPreview />);

        expect(screen.getByRole('link', { name: /Try It Yourself/i })).toBeInTheDocument();
    });
});
