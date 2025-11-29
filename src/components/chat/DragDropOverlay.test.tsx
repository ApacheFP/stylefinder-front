import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DragDropOverlay from './DragDropOverlay';

describe('DragDropOverlay', () => {
    it('renders correctly', () => {
        render(<DragDropOverlay />);

        expect(screen.getByText('Drop your image here')).toBeInTheDocument();
        expect(screen.getByText(/Supported formats/)).toBeInTheDocument();
    });

    it('has pointer-events-none class', () => {
        const { container } = render(<DragDropOverlay />);

        expect(container.firstChild).toHaveClass('pointer-events-none');
    });
});
