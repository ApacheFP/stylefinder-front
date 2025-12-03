/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatMessage from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../../types';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock react-markdown
vi.mock('react-markdown', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock child components
vi.mock('../ui/ProductCard', () => ({
    default: ({ item, onImageClick }: any) => (
        <div data-testid={`product-card-${item.id}`} onClick={onImageClick}>
            {item.name}
        </div>
    ),
}));

vi.mock('../ui/ProductCarousel', () => ({
    default: ({ isOpen, onClose, items }: any) => (
        isOpen ? (
            <div data-testid="product-carousel">
                <button onClick={onClose}>Close Carousel</button>
                {items.map((item: any) => (
                    <div key={item.id}>{item.name}</div>
                ))}
            </div>
        ) : null
    ),
}));

vi.mock('./ImageAttachment', () => ({
    default: ({ imageUrl, altText }: any) => (
        <img data-testid="image-attachment" src={imageUrl} alt={altText} />
    ),
}));

vi.mock('../ui/Button', () => ({
    default: ({ children, onClick, disabled, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    ),
}));

vi.mock('./OutfitExplanation', () => ({
    default: ({ explanation, isVisible }: any) => (
        isVisible ? <div data-testid="outfit-explanation">{explanation}</div> : null
    ),
}));

describe('ChatMessage', () => {
    const mockOnExplainOutfit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user message correctly', () => {
        const message: ChatMessageType = {
            id: '1',
            role: 'user',
            content: 'Hello AI',
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        expect(screen.getByText('Hello AI')).toBeInTheDocument();
        expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'User message');
    });

    it('renders user message with image', () => {
        const message: ChatMessageType = {
            id: '1',
            role: 'user',
            content: 'Check this',
            imageUrl: 'test.jpg',
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        expect(screen.getByTestId('image-attachment')).toHaveAttribute('src', 'test.jpg');
    });

    it('renders assistant message correctly', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is a suggestion',
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        expect(screen.getByText('Here is a suggestion')).toBeInTheDocument();
        expect(screen.getByRole('article')).toHaveAttribute('aria-label', 'Assistant message');
    });

    it('renders outfit items', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [
                    { id: 'p1', name: 'Shirt', price: 50, imageUrl: 'shirt.jpg', category: 'shirt' },
                    { id: 'p2', name: 'Pants', price: 80, imageUrl: 'pants.jpg', category: 'pants' },
                ],
                totalPrice: 130,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        expect(screen.getByTestId('product-card-p1')).toBeInTheDocument();
        expect(screen.getByTestId('product-card-p2')).toBeInTheDocument();
    });

    it('opens carousel when "View Gallery" is clicked', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [{ id: 'p1', name: 'Shirt', price: 50, imageUrl: 'shirt.jpg', category: 'shirt' }],
                totalPrice: 50,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        fireEvent.click(screen.getByText('View Gallery'));
        expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
    });

    it('opens carousel when product card is clicked', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [{ id: 'p1', name: 'Shirt', price: 50, imageUrl: 'shirt.jpg', category: 'shirt' }],
                totalPrice: 50,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        fireEvent.click(screen.getByTestId('product-card-p1'));
        expect(screen.getByTestId('product-carousel')).toBeInTheDocument();
    });

    it('calls onExplainOutfit when explain button is clicked', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [],
                totalPrice: 0,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        fireEvent.click(screen.getByText('Explain this outfit'));
        expect(mockOnExplainOutfit).toHaveBeenCalledWith('2');
    });

    it('shows loading state for explanation', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [],
                totalPrice: 0,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
                isLoadingExplanation={true}
            />
        );

        expect(screen.getByText('Generating')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Explain this outfit' })).toBeDisabled();
    });

    it('shows explanation when present', () => {
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [],
                explanation: 'This looks great because...',
                totalPrice: 0,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        // First click to toggle visibility
        fireEvent.click(screen.getByText('Explain this outfit'));

        expect(screen.getByTestId('outfit-explanation')).toHaveTextContent('This looks great because...');
    });

    it('displays total price and handles Shop All click', () => {
        const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        const message: ChatMessageType = {
            id: '2',
            role: 'assistant',
            content: 'Here is an outfit',
            outfit: {
                id: 'o1',
                items: [
                    { id: 'p1', name: 'Shirt', price: 50, imageUrl: 'shirt.jpg', category: 'shirt', link: 'http://shirt.com' },
                    { id: 'p2', name: 'Pants', price: 80, imageUrl: 'pants.jpg', category: 'pants', link: 'http://pants.com' },
                    { id: 'p3', name: 'Socks', price: 10, imageUrl: 'socks.jpg', category: 'accessories' }, // No link
                ],
                totalPrice: 140,
            },
            timestamp: new Date(),
        };

        render(
            <ChatMessage
                message={message}
                onExplainOutfit={mockOnExplainOutfit}
            />
        );

        // Check total price (50 + 80 + 10 = 140)
        expect(screen.getByText('$140.00')).toBeInTheDocument();
        expect(screen.getByText('Estimated Total')).toBeInTheDocument();

        // Click Shop All
        fireEvent.click(screen.getByText('Shop All Items'));

        // Links should open immediately
        expect(windowOpenSpy).toHaveBeenCalledWith('http://shirt.com', '_blank', 'noopener,noreferrer');
        expect(windowOpenSpy).toHaveBeenCalledWith('http://pants.com', '_blank', 'noopener,noreferrer');
        expect(windowOpenSpy).toHaveBeenCalledTimes(2);

        windowOpenSpy.mockRestore();
    });
});
