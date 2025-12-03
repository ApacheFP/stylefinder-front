/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCarousel from './ProductCarousel';
import type { OutfitItem } from '../../types';

// Mock framer-motion
// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        img: ({ ...props }: any) => <img {...props} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Modal
vi.mock('./Modal', () => ({
    default: ({ children, isOpen, onClose }: any) => (
        isOpen ? (
            <div data-testid="modal">
                <button onClick={onClose} data-testid="modal-close">Close Modal</button>
                {children}
            </div>
        ) : null
    ),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ChevronLeft: () => <span data-testid="chevron-left" />,
    ChevronRight: () => <span data-testid="chevron-right" />,
    ShoppingBag: () => <span data-testid="shopping-bag" />,
    X: () => <span data-testid="close-icon" />,
    ZoomIn: () => <span data-testid="zoom-in" />,
    ZoomOut: () => <span data-testid="zoom-out" />,
}));

const mockItems: OutfitItem[] = [
    {
        id: '1',
        name: 'Test Item 1',
        price: 100,
        imageUrl: 'test1.jpg',
        brand: 'Brand A',
        link: 'http://test1.com',
        category: 'jacket'
    },
    {
        id: '2',
        name: 'Test Item 2',
        price: 200,
        imageUrl: 'test2.jpg',
        brand: 'Brand B',
        link: 'http://test2.com',
        category: 'pants'
    },
];

describe('ProductCarousel', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(
            <ProductCarousel
                isOpen={true}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={0}
            />
        );

        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Test Item 1')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <ProductCarousel
                isOpen={false}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={0}
            />
        );

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('navigates to next item', () => {
        render(
            <ProductCarousel
                isOpen={true}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={0}
            />
        );

        const nextButton = screen.getByTestId('chevron-right').closest('button');
        fireEvent.click(nextButton!);

        expect(screen.getByText('Test Item 2')).toBeInTheDocument();
        expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });

    it('navigates to previous item', () => {
        render(
            <ProductCarousel
                isOpen={true}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={1}
            />
        );

        const prevButton = screen.getByTestId('chevron-left').closest('button');
        fireEvent.click(prevButton!);

        expect(screen.getByText('Test Item 1')).toBeInTheDocument();
        expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    it('toggles zoom', () => {
        render(
            <ProductCarousel
                isOpen={true}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={0}
            />
        );

        const zoomButton = screen.getByTestId('zoom-in').closest('button');
        fireEvent.click(zoomButton!);

        expect(screen.getByTestId('zoom-out')).toBeInTheDocument();

        fireEvent.click(zoomButton!);
        expect(screen.getByTestId('zoom-in')).toBeInTheDocument();
    });

    it('handles keyboard navigation', () => {
        const onClose = vi.fn();
        render(
            <ProductCarousel
                isOpen={true}
                onClose={onClose}
                items={mockItems}
                initialIndex={0}
            />
        );

        fireEvent.keyDown(window, { key: 'ArrowRight' });
        expect(screen.getByText('Test Item 2')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'ArrowLeft' });
        expect(screen.getByText('Test Item 1')).toBeInTheDocument();

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });
    it('renders shop link correctly', () => {
        render(
            <ProductCarousel
                isOpen={true}
                onClose={vi.fn()}
                items={mockItems}
                initialIndex={0}
            />
        );

        const shopLink = screen.getByText('Shop Now').closest('a');
        expect(shopLink).toHaveAttribute('href', 'http://test1.com');
        expect(shopLink).toHaveAttribute('target', '_blank');
        expect(shopLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
});
