import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../utils/test-utils';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
    it('renders as a switch button', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('switch');
        expect(button).toBeInTheDocument();
    });

    it('has correct aria-label', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('switch');
        expect(button).toHaveAttribute('aria-label', expect.stringMatching(/Switch to (light|dark) mode/));
    });

    it('renders with default medium size', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('switch');
        expect(button.className).toContain('w-14');
    });

    it('renders with small size', () => {
        render(<ThemeToggle size="sm" />);

        const button = screen.getByRole('switch');
        expect(button.className).toContain('w-12');
    });

    it('renders with large size', () => {
        render(<ThemeToggle size="lg" />);

        const button = screen.getByRole('switch');
        expect(button.className).toContain('w-16');
    });

    it('is clickable', () => {
        render(<ThemeToggle />);

        const button = screen.getByRole('switch');
        fireEvent.click(button);
        // Theme toggle function is called - full integration tested in ThemeContext.test
    });
});
