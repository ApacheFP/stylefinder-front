/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from './Modal';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, ...props }: any) => (
            <div onClick={onClick} {...props}>
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    X: () => <span data-testid="close-icon" />,
}));

describe('Modal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        children: <div>Modal Content</div>,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(<Modal {...defaultProps} />);

        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<Modal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<Modal {...defaultProps} />);

        const closeButton = screen.getByTestId('close-icon').closest('button');
        fireEvent.click(closeButton!);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<Modal {...defaultProps} />);

        // The backdrop is the first child of the portal (which is document.body)
        // But render returns container which is a div appended to body.
        // Modal uses createPortal to document.body.
        // So we need to look at document.body directly or use screen queries.

        // The backdrop has an onClick handler.
        // In our mock, it's the outer div.
        // Let's find it by class since it doesn't have a specific role/text
        // Or we can add a test id in the component, but we can't modify component code.
        // The backdrop has class 'fixed inset-0 ...'

        // Actually, since we mock motion.div, we can just click the parent of the content wrapper?
        // The structure is: Backdrop > ContentWrapper > Children

        const content = screen.getByText('Modal Content');
        const contentWrapper = content.parentElement; // motion.div (content)
        const backdrop = contentWrapper?.parentElement; // motion.div (backdrop)

        fireEvent.click(backdrop!);

        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('does not call onClose when content is clicked', () => {
        render(<Modal {...defaultProps} />);

        const content = screen.getByText('Modal Content');
        fireEvent.click(content);

        expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('locks body scroll when open', () => {
        render(<Modal {...defaultProps} />);

        expect(document.body.style.overflow).toBe('hidden');
    });

    it('unlocks body scroll when closed', () => {
        const { rerender } = render(<Modal {...defaultProps} />);

        expect(document.body.style.overflow).toBe('hidden');

        rerender(<Modal {...defaultProps} isOpen={false} />);

        expect(document.body.style.overflow).toBe('unset');
    });
});
