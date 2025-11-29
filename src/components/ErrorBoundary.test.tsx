import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error
const ThrowError = ({ message }: { message: string }) => {
    throw new Error(message);
};

describe('ErrorBoundary', () => {
    // Suppress console.error during tests to keep output clean
    const originalConsoleError = console.error;

    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    it('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Safe Content</div>
            </ErrorBoundary>
        );

        expect(screen.getByText('Safe Content')).toBeInTheDocument();
        expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
    });

    it('renders error UI when an error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError message="Test Error" />
            </ErrorBoundary>
        );

        expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    it('reloads page when reload button is clicked', () => {
        // Mock window.location.reload
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        render(
            <ErrorBoundary>
                <ThrowError message="Test Error" />
            </ErrorBoundary>
        );

        const reloadButton = screen.getByText('Reload Application').closest('button');
        fireEvent.click(reloadButton!);

        expect(reloadMock).toHaveBeenCalled();
    });
});
