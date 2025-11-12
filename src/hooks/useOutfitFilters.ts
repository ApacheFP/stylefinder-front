import { useState } from 'react';
import type { OutfitFilters } from '../types';

export const useOutfitFilters = () => {
  const [filters, setFilters] = useState<OutfitFilters>({
    budgetMax: 150,
    outfitType: 'full',
    selectedItems: [],
  });

  const updateBudget = (budget: number) => {
    setFilters((prev) => ({ ...prev, budgetMax: budget }));
  };

  const updateOutfitType = (type: 'full' | 'partial') => {
    setFilters((prev) => ({ ...prev, outfitType: type }));
  };

  const toggleItem = (item: 'jacket' | 'blazer' | 'shirt' | 'pants' | 'shoes') => {
    setFilters((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(item)
        ? prev.selectedItems.filter((i) => i !== item)
        : [...prev.selectedItems, item],
    }));
  };

  const resetFilters = () => {
    setFilters({
      budgetMax: undefined,
      outfitType: 'full',
      selectedItems: [],
    });
  };

  return {
    filters,
    updateBudget,
    updateOutfitType,
    toggleItem,
    resetFilters,
  };
};
