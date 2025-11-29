import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOutfitFilters } from './useOutfitFilters';

describe('useOutfitFilters', () => {
    it('initializes with default filters', () => {
        const { result } = renderHook(() => useOutfitFilters());

        expect(result.current.filters).toEqual({
            budgetMax: 150,
            outfitType: 'full',
            selectedItems: [],
        });
    });

    it('updates budget', () => {
        const { result } = renderHook(() => useOutfitFilters());

        act(() => {
            result.current.updateBudget(200);
        });

        expect(result.current.filters.budgetMax).toBe(200);
    });

    it('updates outfit type', () => {
        const { result } = renderHook(() => useOutfitFilters());

        act(() => {
            result.current.updateOutfitType('partial');
        });

        expect(result.current.filters.outfitType).toBe('partial');
    });

    it('toggles items', () => {
        const { result } = renderHook(() => useOutfitFilters());

        // Select item
        act(() => {
            result.current.toggleItem('jacket');
        });
        expect(result.current.filters.selectedItems).toContain('jacket');

        // Deselect item
        act(() => {
            result.current.toggleItem('jacket');
        });
        expect(result.current.filters.selectedItems).not.toContain('jacket');
    });

    it('resets filters', () => {
        const { result } = renderHook(() => useOutfitFilters());

        act(() => {
            result.current.updateBudget(500);
            result.current.updateOutfitType('partial');
            result.current.toggleItem('shoes');
        });

        act(() => {
            result.current.resetFilters();
        });

        expect(result.current.filters).toEqual({
            budgetMax: undefined,
            outfitType: 'full',
            selectedItems: [],
        });
    });
});
