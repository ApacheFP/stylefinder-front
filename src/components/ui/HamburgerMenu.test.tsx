import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HamburgerMenu from './HamburgerMenu';

describe('HamburgerMenu', () => {
    it('renders correctly', () => {
        render(<HamburgerMenu isOpen={false} onClick={() => { }} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<HamburgerMenu isOpen={false} onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('shows open state', () => {
        render(<HamburgerMenu isOpen={true} onClick={() => { }} />);
        // Verify visual change if possible, e.g. aria-label or class
    });
});
