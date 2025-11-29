/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import TypingIndicator from './TypingIndicator';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div data-testid="motion-dot" {...props}>{children}</div>,
    },
}));

describe('TypingIndicator', () => {
    it('renders three dots', () => {
        const { getAllByTestId } = render(<TypingIndicator />);

        const dots = getAllByTestId('motion-dot');
        expect(dots).toHaveLength(3);
    });

    it('renders with correct styling', () => {
        const { container } = render(<TypingIndicator />);

        expect(container.firstChild).toHaveClass('flex', 'items-center', 'gap-1.5', 'py-3', 'px-4');
    });
});
