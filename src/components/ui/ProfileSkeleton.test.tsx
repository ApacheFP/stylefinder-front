import { describe, it, expect } from 'vitest';
import { render } from '../../utils/test-utils';
import ProfileSkeleton from './ProfileSkeleton';

describe('ProfileSkeleton', () => {
    it('renders skeleton container', () => {
        const { container } = render(<ProfileSkeleton />);

        // Should have a container with min-h-screen
        expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    it('renders multiple skeleton sections', () => {
        const { container } = render(<ProfileSkeleton />);

        // Check for skeleton structure - rounded corners indicate skeleton cards
        const roundedElements = container.querySelectorAll('.rounded-2xl');
        expect(roundedElements.length).toBeGreaterThan(0);
    });
});
