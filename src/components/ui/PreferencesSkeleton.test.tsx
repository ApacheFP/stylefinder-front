import { describe, it, expect } from 'vitest';
import { render } from '../../utils/test-utils';
import PreferencesSkeleton from './PreferencesSkeleton';

describe('PreferencesSkeleton', () => {
    it('renders skeleton container', () => {
        const { container } = render(<PreferencesSkeleton />);

        // Should have a container with min-h-screen
        expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });

    it('renders preference section skeletons', () => {
        const { container } = render(<PreferencesSkeleton />);

        // Should render skeleton elements
        const skeletonDivs = container.querySelectorAll('.rounded-full');
        expect(skeletonDivs.length).toBeGreaterThan(0);
    });

    it('renders button skeletons', () => {
        const { container } = render(<PreferencesSkeleton />);

        // Should have skeleton buttons (flex-1)
        const flexSkeletons = container.querySelectorAll('.flex-1');
        expect(flexSkeletons.length).toBeGreaterThanOrEqual(2);
    });
});
