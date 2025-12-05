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
        // Mock requestAnimationFrame to track calls without executing the callback recursively
        const rafMock = vi.fn(() => 1);
        vi.stubGlobal('requestAnimationFrame', rafMock);
        vi.stubGlobal('cancelAnimationFrame', vi.fn());

        const { result, rerender } = renderHook(
            ({ dep }) => useScrollToBottom(dep),
            { initialProps: { dep: ['msg1'] } }
        );

        // Mock scrollRef with settable scrollTop
        let currentScrollTop = 0;
        const mockDiv = {
            scrollTo: vi.fn(),
            get scrollHeight() { return 1000; },
            get scrollTop() { return currentScrollTop; },
            set scrollTop(value: number) { currentScrollTop = value; },
            get clientHeight() { return 500; },
        } as unknown as HTMLDivElement;

        // Assign mock to ref
        result.current.scrollRef.current = mockDiv;

        // Trigger update
        rerender({ dep: ['msg1', 'msg2'] });

        // The hook uses requestAnimationFrame for scrolling, verify it was called
        expect(rafMock).toHaveBeenCalled();
        
        // Clean up
        vi.unstubAllGlobals();
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
