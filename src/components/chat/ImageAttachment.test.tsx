/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageAttachment from './ImageAttachment';

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

// Mock ImageLightbox
vi.mock('../ui/ImageLightbox', () => ({
    default: ({ isOpen, onClose }: any) => (
        isOpen ? (
            <div data-testid="lightbox">
                <button onClick={onClose}>Close</button>
            </div>
        ) : null
    ),
}));

describe('ImageAttachment', () => {
    it('renders image correctly', () => {
        render(<ImageAttachment imageUrl="test.jpg" altText="Test Image" />);

        const img = screen.getByAltText('Test Image');
        expect(img).toHaveAttribute('src', 'test.jpg');
    });

    it('shows loading state initially', () => {
        render(<ImageAttachment imageUrl="test.jpg" />);

        // Check for spinner (using class selector as it doesn't have text)
        // Note: In a real test we might want to add a test id to the spinner
        // Here we check if the image is hidden (opacity-0)
        const img = screen.getByRole('img');
        expect(img).toHaveClass('opacity-0');
    });

    it('removes loading state on load', () => {
        render(<ImageAttachment imageUrl="test.jpg" />);

        const img = screen.getByRole('img');
        fireEvent.load(img);

        expect(img).toHaveClass('opacity-100');
    });

    it('shows error state on error', () => {
        render(<ImageAttachment imageUrl="test.jpg" />);

        const img = screen.getByRole('img');
        fireEvent.error(img);

        expect(screen.getByText('Failed to load image')).toBeInTheDocument();
    });

    it('opens lightbox on click', () => {
        render(<ImageAttachment imageUrl="test.jpg" />);

        const img = screen.getByRole('img');
        fireEvent.load(img); // Must load first to be clickable

        // Click the container (motion.div)
        fireEvent.click(img.closest('div')!);

        expect(screen.getByTestId('lightbox')).toBeInTheDocument();
    });

    it('closes lightbox', () => {
        render(<ImageAttachment imageUrl="test.jpg" />);

        const img = screen.getByRole('img');
        fireEvent.load(img);
        fireEvent.click(img.closest('div')!);

        fireEvent.click(screen.getByText('Close'));

        expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument();
    });
});
