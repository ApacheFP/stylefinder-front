import { describe, it, expect } from 'vitest';
import { render } from '../../utils/test-utils';
import ParticleBackground from './ParticleBackground';

describe('ParticleBackground', () => {
    it('renders canvas element', () => {
        const { container } = render(<ParticleBackground />);

        const canvas = container.querySelector('canvas');
        expect(canvas).toBeInTheDocument();
    });

    it('has absolute positioning', () => {
        const { container } = render(<ParticleBackground />);

        const canvas = container.querySelector('canvas');
        expect(canvas?.className).toContain('absolute');
    });

    it('has inset-0 for full coverage', () => {
        const { container } = render(<ParticleBackground />);

        const canvas = container.querySelector('canvas');
        expect(canvas?.className).toContain('inset-0');
    });

    it('has pointer-events-none', () => {
        const { container } = render(<ParticleBackground />);

        const canvas = container.querySelector('canvas');
        expect(canvas?.className).toContain('pointer-events-none');
    });
});
