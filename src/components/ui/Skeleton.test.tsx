/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    },
}));

describe('Skeleton', () => {
    it('renders correctly with default props', () => {
        const { container } = render(<Skeleton />);
        const skeleton = container.firstChild;

        expect(skeleton).toHaveClass('bg-gray-200', 'dark:bg-surface-muted', 'h-4', 'rounded');
    });

    it('renders circular variant', () => {
        const { container } = render(<Skeleton variant="circular" />);
        const skeleton = container.firstChild;

        expect(skeleton).toHaveClass('rounded-full');
    });

    it('renders rectangular variant', () => {
        const { container } = render(<Skeleton variant="rectangular" />);
        const skeleton = container.firstChild;

        expect(skeleton).toHaveClass('rounded-lg');
    });

    it('applies custom className', () => {
        const { container } = render(<Skeleton className="w-20 h-20" />);
        const skeleton = container.firstChild;

        expect(skeleton).toHaveClass('w-20', 'h-20');
    });

    it('renders wave animation element', () => {
        const { container } = render(<Skeleton animation="wave" />);
        const skeleton = container.firstChild;

        // Check if it has a child (the wave element)
        expect(skeleton?.childNodes.length).toBeGreaterThan(0);
    });

    it('does not render wave animation element when animation is pulse', () => {
        const { container } = render(<Skeleton animation="pulse" />);
        const skeleton = container.firstChild;

        // Should not have the wave child
        expect(skeleton?.childNodes.length).toBe(0);
    });
});
