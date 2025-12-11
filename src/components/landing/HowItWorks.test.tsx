import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import HowItWorks from './HowItWorks';

describe('HowItWorks', () => {
    it('renders section heading', () => {
        render(<HowItWorks />);

        expect(screen.getByText('How It Works')).toBeInTheDocument();
        expect(screen.getByText('Three Steps')).toBeInTheDocument();
    });

    it('renders all three steps', () => {
        render(<HowItWorks />);

        expect(screen.getByText('Describe')).toBeInTheDocument();
        expect(screen.getByText('Discover')).toBeInTheDocument();
        expect(screen.getByText('Shop')).toBeInTheDocument();
    });

    it('renders step numbers', () => {
        render(<HowItWorks />);

        expect(screen.getByText('01')).toBeInTheDocument();
        expect(screen.getByText('02')).toBeInTheDocument();
        expect(screen.getByText('03')).toBeInTheDocument();
    });

    it('renders step descriptions', () => {
        render(<HowItWorks />);

        expect(screen.getByText(/Tell the AI about your event/)).toBeInTheDocument();
        expect(screen.getByText(/Review curated outfits/)).toBeInTheDocument();
        expect(screen.getByText(/Select your favorite pieces/)).toBeInTheDocument();
    });
});
