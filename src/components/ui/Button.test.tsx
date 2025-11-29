import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import Button from './Button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
    });

    it('shows loading state', () => {
        render(<Button isLoading>Click me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // Loader icon should be present (we can check for svg or just disabled state)
    });

    it('applies variant classes', () => {
        render(<Button variant="outline">Outline Button</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('border-2');
    });
});
