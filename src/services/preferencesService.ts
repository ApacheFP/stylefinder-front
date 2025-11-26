import api from './api';
import type { UserPreferences } from '../types';

/**
 * Preferences Service
 * 
 * Backend endpoints:
 *   PUT/POST /preferences - Update user preferences
 *   GET /user/session - Get preferences (included in user data)
 * 
 * Note: Backend stores arrays as strings, so we need to parse them.
 * Backend uses snake_case keys (gender, favorite_styles, favorite_colors)
 * Frontend uses camelCase keys (gender, favoriteStyles, favoriteColors)
 */

// Helper to parse preferences from backend format
const parsePreferences = (prefs: Record<string, string> | null): UserPreferences | null => {
  if (!prefs || Object.keys(prefs).length === 0) return null;
  
  // Parse array values that are stored as strings
  const parseArrayValue = (value: string | string[] | undefined): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    // Try to parse as JSON array
    try {
      const parsed = JSON.parse(value.replace(/'/g, '"'));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Map backend snake_case to frontend camelCase
  return {
    gender: (prefs.gender as 'man' | 'woman' | 'non-binary') || 'man',
    favoriteStyles: parseArrayValue(prefs.favorite_styles || prefs.favoriteStyles),
    favoriteColors: parseArrayValue(prefs.favorite_colors || prefs.favoriteColors),
  };
};

export const preferencesService = {
  // Get user preferences (from session endpoint since there's no dedicated GET)
  getPreferences: async (): Promise<UserPreferences | null> => {
    try {
      const response = await api.get<{ success: boolean; user: { preferences: Record<string, string> } }>('/user/session');
      console.log('Raw preferences from backend:', response.data.user.preferences);
      const parsed = parsePreferences(response.data.user.preferences);
      console.log('Parsed preferences:', parsed);
      return parsed;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences: UserPreferences): Promise<boolean> => {
    // Convert to backend format: snake_case keys and JSON strings for arrays
    const backendPrefs = {
      gender: preferences.gender,
      favorite_styles: JSON.stringify(preferences.favoriteStyles),
      favorite_colors: JSON.stringify(preferences.favoriteColors),
    };
    const response = await api.put<{ success: boolean }>('/preferences', backendPrefs);
    return response.data.success;
  },
};
