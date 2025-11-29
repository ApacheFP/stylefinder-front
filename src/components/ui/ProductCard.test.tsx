import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import type { OutfitItem } from '../../types';

describe('ProductCard Component', () => {
    const mockProduct: OutfitItem = {
        id: '1',
        name: 'Test Product',
        imageUrl: 'https://example.com/jacket.jpg',
        price: 99.99,
        brand: 'FashionBrand',
        link: 'https://example.com/shop/jacket',
        category: 'jacket'
    };

    it('renders product details correctly', () => {
        render(<ProductCard item={mockProduct} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('FashionBrand')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product')).toHaveAttribute('src', 'https://example.com/jacket.jpg');
    });

    it('opens link when shop button is clicked', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
        render(<ProductCard item={mockProduct} />);

        const shopButton = screen.getByText('Shop');
        fireEvent.click(shopButton);

        expect(openSpy).toHaveBeenCalledWith('https://example.com/shop/jacket', '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });

    it('disables shop button when no link is provided', () => {
        const itemWithoutLink = { ...mockProduct, link: undefined };
        render(<ProductCard item={itemWithoutLink} />);

        const shopElement = screen.getByText('Shop').closest('div');
        expect(shopElement).toHaveClass('opacity-50');
        expect(screen.queryByRole('button', { name: /shop/i })).not.toBeInTheDocument();
    });
});
