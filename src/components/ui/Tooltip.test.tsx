/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Tooltip from './Tooltip';

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Tooltip', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders children correctly', () => {
        render(
            <Tooltip content="Tooltip text">
                <button>Hover me</button>
            </Tooltip>
        );

        expect(screen.getByText('Hover me')).toBeInTheDocument();
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('shows tooltip on hover after delay', () => {
        render(
            <Tooltip content="Tooltip text" delay={300}>
                <button>Hover me</button>
            </Tooltip>
        );

        fireEvent.mouseEnter(screen.getByText('Hover me'));

        // Should not be visible yet
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();

        // Fast forward time
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.getByText('Tooltip text')).toBeInTheDocument();
    });

    it('hides tooltip on mouse leave', () => {
        render(
            <Tooltip content="Tooltip text" delay={0}>
                <button>Hover me</button>
            </Tooltip>
        );

        fireEvent.mouseEnter(screen.getByText('Hover me'));

        act(() => {
            vi.advanceTimersByTime(0);
        });

        expect(screen.getByText('Tooltip text')).toBeInTheDocument();

        fireEvent.mouseLeave(screen.getByText('Hover me'));

        // Should disappear immediately (or after animation, but mocked here)
        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('clears timeout on mouse leave before delay', () => {
        render(
            <Tooltip content="Tooltip text" delay={300}>
                <button>Hover me</button>
            </Tooltip>
        );

        fireEvent.mouseEnter(screen.getByText('Hover me'));

        // Leave before delay
        act(() => {
            vi.advanceTimersByTime(100);
        });
        fireEvent.mouseLeave(screen.getByText('Hover me'));

        // Fast forward past original delay
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
});
