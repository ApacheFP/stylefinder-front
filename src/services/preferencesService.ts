import api from './api';


export const preferencesService = {
  // Get user preferences
  getPreferences: async (): Promise<Record<string, unknown> | null> => {
    try {
      const response = await api.get<{ success: boolean; user: { preferences: Record<string, string> } }>('/user/session');
      console.log('Raw preferences from backend:', response.data.user.preferences);
      return response.data.user.preferences || {};
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  },

  // Update user preferences
  updatePreferences: async (preferences: Record<string, unknown>): Promise<boolean> => {
    // Send as is, backend handles the mapping by name
    const response = await api.put<{ success: boolean }>('/preferences', preferences);
    return response.data.success;
  },

  // Get all available preferences (names and ids)
  getAllPreferences: async (): Promise<Array<{ id: number; name: string }>> => {
    try {
      const response = await api.get<{ preferences?: Array<{ id: number; name: string }> } | Record<string, string>>('/preferences/all');
      console.log('Raw all preferences response:', response.data);

      // Case 1: Response is { success: true, preferences: [...] }
      if ('preferences' in response.data && Array.isArray(response.data.preferences)) {
        return response.data.preferences.map((p) => ({
          id: p.id,
          name: p.name
        }));
      }

      // Case 2: Response is { "1": "gender", ... } (Dictionary)
      // We use index as ID to be safe if keys are strings
      return Object.entries(response.data).map(([, value], index) => {
        // Filter out non-preference keys if mixed (like "success": true)
        if (typeof value !== 'string') return null;

        return {
          id: index,
          name: value
        };
      }).filter((p): p is { id: number; name: string } => p !== null);

    } catch (error) {
      console.error('Error loading all preferences:', error);
      return [];
    }
  },
};
