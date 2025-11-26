import api from './api';
import type { UserPreferences } from '../types';

/**
 * Preferences Service
 * 
 * Backend endpoints:
 *   PUT/POST /preferences - Update user preferences
 *   GET /user/session - Get preferences (included in user data)
 */

export const preferencesService = {
  // Get user preferences (from session endpoint since there's no dedicated GET)
  getPreferences: async (): Promise<UserPreferences | null> => {
    try {
      const response = await api.get<{ success: boolean; user: { preferences: UserPreferences } }>('/user/session');
      return response.data.user.preferences || null;
    } catch {
      return null;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences: UserPreferences): Promise<boolean> => {
    const response = await api.put<{ success: boolean }>('/preferences', preferences);
    return response.data.success;
  },
};
