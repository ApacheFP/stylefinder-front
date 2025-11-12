import api from './api';
import type { UserPreferences } from '../types';

/**
 * Preferences Service
 * 
 * NOTE FOR BACKEND TEAM:
 * See BACKEND_INTEGRATION.md for API specifications.
 */

export const preferencesService = {
  // Get user preferences
  getPreferences: async () => {
    const response = await api.get('/preferences');
    return response.data;
  },

  // Update user preferences
  updatePreferences: async (preferences: UserPreferences) => {
    const response = await api.put('/preferences', preferences);
    return response.data;
  },
};
