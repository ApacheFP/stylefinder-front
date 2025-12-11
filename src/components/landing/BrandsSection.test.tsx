import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import BrandsSection from './BrandsSection';

describe('BrandsSection', () => {
    it('renders section title', () => {
        render(<BrandsSection />);

        expect(screen.getByText('Curated from World-Class Brands')).toBeInTheDocument();
    });

    it('renders all brand logos', () => {
        render(<BrandsSection />);

        const brandNames = ['H&M', 'Nike', 'ZARA', 'adidas', 'Mango'];
        brandNames.forEach((name) => {
            expect(screen.getByAltText(`${name} logo`)).toBeInTheDocument();
        });
    });

    it('renders 5 brand images', () => {
        render(<BrandsSection />);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(5);
    });
});
