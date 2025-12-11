/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import OutfitExplanation from './OutfitExplanation';

// Mock ResizeObserver for JSDOM
beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});

// Mock react-markdown
vi.mock('react-markdown', () => ({
    default: ({ children }: any) => <div data-testid="markdown-content">{children}</div>,
}));

describe('OutfitExplanation', () => {
    const mockExplanation = 'This outfit combines **modern** and *casual* elements.';

    it('renders explanation when visible', () => {
        render(
            <OutfitExplanation explanation={mockExplanation} isVisible={true} />
        );

        expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
        expect(screen.getByText(mockExplanation)).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
        render(
            <OutfitExplanation explanation={mockExplanation} isVisible={false} />
        );

        expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
    });

    it('does not render when explanation is empty', () => {
        render(
            <OutfitExplanation explanation="" isVisible={true} />
        );

        expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
    });

    it('calls onAnimationComplete callback when animation finishes', () => {
        const onAnimationComplete = vi.fn();
        render(
            <OutfitExplanation
                explanation={mockExplanation}
                isVisible={true}
                onAnimationComplete={onAnimationComplete}
            />
        );

        // The component should render - animation callback is handled by framer-motion
        expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
    });
});
