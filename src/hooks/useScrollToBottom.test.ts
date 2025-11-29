import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollToBottom } from './useScrollToBottom';

describe('useScrollToBottom', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('initializes correctly', () => {
        const { result } = renderHook(() => useScrollToBottom(null));

        expect(result.current.scrollRef.current).toBeNull();
        expect(result.current.showScrollButton).toBe(false);
    });

    it('scrolls to bottom when dependency changes', () => {
        const { result, rerender } = renderHook(
            ({ dep }) => useScrollToBottom(dep),
            { initialProps: { dep: ['msg1'] } }
        );

        // Mock scrollRef
        const scrollToMock = vi.fn();
        const mockDiv = {
            scrollTo: scrollToMock,
            scrollHeight: 1000,
            scrollTop: 0,
            clientHeight: 500,
        } as unknown as HTMLDivElement;

        // Assign mock to ref
        // @ts-expect-error - writing to readonly property for testing
        result.current.scrollRef.current = mockDiv;

        // Trigger update
        rerender({ dep: ['msg1', 'msg2'] });

        expect(scrollToMock).toHaveBeenCalledWith({
            top: 1000,
            behavior: 'smooth',
        });
    });

    it('shows scroll button when user scrolls up', () => {
        const { result } = renderHook(() => useScrollToBottom(null));

        const mockDiv = {
            scrollTo: vi.fn(),
            scrollHeight: 1000,
            scrollTop: 100, // Far from bottom
            clientHeight: 500,
        } as unknown as HTMLDivElement;

        // @ts-expect-error - Testing read-only property
        result.current.scrollRef.current = mockDiv;

        act(() => {
            result.current.handleScroll();
        });

        expect(result.current.showScrollButton).toBe(true);
    });

    it('hides scroll button when user scrolls to bottom', () => {
        const { result } = renderHook(() => useScrollToBottom(null));

        const mockDiv = {
            scrollTo: vi.fn(),
            scrollHeight: 1000,
            scrollTop: 950, // Near bottom
            clientHeight: 500, // 1000 - 950 - 500 = -450 < 100
        } as unknown as HTMLDivElement;

        // @ts-expect-error - Testing read-only property
        result.current.scrollRef.current = mockDiv;

        act(() => {
            result.current.handleScroll();
        });

        expect(result.current.showScrollButton).toBe(false);
    });

    it('does not auto-scroll if user is scrolling', () => {
        const { result, rerender } = renderHook(
            ({ dep }) => useScrollToBottom(dep),
            { initialProps: { dep: ['msg1'] } }
        );

        const scrollToMock = vi.fn();
        const mockDiv = {
            scrollTo: scrollToMock,
            scrollHeight: 1000,
            scrollTop: 100,
            clientHeight: 500,
        } as unknown as HTMLDivElement;

        // @ts-expect-error - Testing read-only property
        result.current.scrollRef.current = mockDiv;

        // Simulate user scrolling
        act(() => {
            result.current.handleScroll();
        });

        // Trigger update
        rerender({ dep: ['msg1', 'msg2'] });

        // Should NOT scroll because user is scrolling (simulated by handleScroll setting isUserScrolling=true)
        // Note: handleScroll sets isUserScrolling=true immediately.
        // However, the effect depends on isUserScrolling state.
        // Let's verify the state change prevents the effect.

        expect(scrollToMock).not.toHaveBeenCalled();
    });
});
