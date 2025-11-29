import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('initializes with default value if storage is empty', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        expect(result.current[0]).toBe('default');
    });

    it('initializes with stored value if exists', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored'));
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
        expect(result.current[0]).toBe('stored');
    });

    it('updates state and localStorage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

        act(() => {
            result.current[1]('new-value');
        });

        expect(result.current[0]).toBe('new-value');
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });

    it('accepts function update', () => {
        const { result } = renderHook(() => useLocalStorage('count', 1));

        act(() => {
            result.current[1]((prev) => prev + 1);
        });

        expect(result.current[0]).toBe(2);
        expect(window.localStorage.getItem('count')).toBe('2');
    });

    it('handles localStorage errors gracefully', () => {
        // Mock getItem to throw
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Storage error');
        });
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const { result } = renderHook(() => useLocalStorage('error-key', 'fallback'));

        expect(result.current[0]).toBe('fallback');
        expect(consoleSpy).toHaveBeenCalled();
    });
});
