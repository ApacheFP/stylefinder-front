/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollToBottomButton from './ScrollToBottomButton';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        button: ({ children, onClick, ...props }: any) => (
            <button onClick={onClick} data-testid="scroll-button" {...props}>
                {children}
            </button>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('ScrollToBottomButton', () => {
    it('renders when show is true', () => {
        render(<ScrollToBottomButton show={true} onClick={() => { }} />);
        expect(screen.getByTestId('scroll-button')).toBeInTheDocument();
    });

    it('does not render when show is false', () => {
        render(<ScrollToBottomButton show={false} onClick={() => { }} />);
        expect(screen.queryByTestId('scroll-button')).not.toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<ScrollToBottomButton show={true} onClick={handleClick} />);

        fireEvent.click(screen.getByTestId('scroll-button'));
        expect(handleClick).toHaveBeenCalled();
    });
});
