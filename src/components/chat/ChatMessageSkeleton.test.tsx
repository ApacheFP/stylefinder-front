import { describe, it, expect } from 'vitest';
import { render, screen } from '../../utils/test-utils';
import ChatMessageSkeleton from './ChatMessageSkeleton';

describe('ChatMessageSkeleton', () => {
    it('renders skeleton elements', () => {
        render(<ChatMessageSkeleton />);

        // Should render multiple skeleton elements for user and AI messages
        const skeletons = document.querySelectorAll('[class*="animate"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders user message skeleton area', () => {
        const { container } = render(<ChatMessageSkeleton />);

        // User message area is on the right (justify-end)
        const userMessageArea = container.querySelector('.justify-end');
        expect(userMessageArea).toBeInTheDocument();
    });

    it('renders AI message skeleton area', () => {
        const { container } = render(<ChatMessageSkeleton />);

        // AI message area is on the left (justify-start)
        const aiMessageArea = container.querySelector('.justify-start');
        expect(aiMessageArea).toBeInTheDocument();
    });

    it('renders product card skeletons', () => {
        const { container } = render(<ChatMessageSkeleton />);

        // Should have 4 product card skeletons
        const productCardSkeletons = container.querySelectorAll('[style*="width: 140px"]');
        expect(productCardSkeletons).toHaveLength(4);
    });
});
