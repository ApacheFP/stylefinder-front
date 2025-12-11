import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import ValueProposition from './ValueProposition';

describe('ValueProposition', () => {
    it('renders section heading', () => {
        render(<ValueProposition />);

        expect(screen.getByText('Why StyleFinder')).toBeInTheDocument();
        expect(screen.getByText('Your Personal Stylist,')).toBeInTheDocument();
        expect(screen.getByText('Powered by AI')).toBeInTheDocument();
    });

    it('renders all feature cards', () => {
        render(<ValueProposition />);

        expect(screen.getByText('Intent-Based Search')).toBeInTheDocument();
        expect(screen.getByText('Complete Outfits')).toBeInTheDocument();
        expect(screen.getByText('Save Time')).toBeInTheDocument();
        expect(screen.getByText('Personalized')).toBeInTheDocument();
    });

    it('renders feature descriptions', () => {
        render(<ValueProposition />);

        expect(screen.getByText(/Forget keywords/)).toBeInTheDocument();
        expect(screen.getByText(/cohesive, ready-to-wear looks/)).toBeInTheDocument();
        expect(screen.getByText(/Skip the endless scrolling/)).toBeInTheDocument();
        expect(screen.getByText(/AI learns your style/)).toBeInTheDocument();
    });
});
