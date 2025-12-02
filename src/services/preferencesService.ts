import api from './api';

// Nuova struttura delle preferenze dal backend
export interface PreferenceOption {
  id: number;
  name: string;
  values: string[];
}

export type AllPreferencesResponse = Record<string, PreferenceOption>;

export const preferencesService = {
  // Get user preferences (ritorna es. { "Brand": "h&m,zara", "Genere": "male" })
  getPreferences: async (): Promise<Record<string, string> | null> => {
    try {
      const response = await api.get<{ success: boolean; user: { preferences: Record<string, string> } }>('/user/session');
      console.log('Raw preferences from backend:', response.data.user.preferences);
      return response.data.user.preferences || {};
    } catch (error) {
      console.error('Error loading preferences:', error);
      return null;
    }
  },

  // Update user preferences (invia es. { "Brand": "h&m,zara", "Genere": "male" })
  updatePreferences: async (preferences: Record<string, string>): Promise<boolean> => {
    const response = await api.put<{ success: boolean }>('/preferences', preferences);
    return response.data.success;
  },

  // Get all available preferences con i loro valori possibili
  getAllPreferences: async (): Promise<AllPreferencesResponse> => {
    try {
      const response = await api.get<AllPreferencesResponse>('/preferences/all');
      console.log('Raw all preferences response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading all preferences:', error);
      return {};
    }
  },

  // Helper: converte stringa separata da virgola in array
  parseMultiValue: (value: string | undefined): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(v => v.trim()).filter(v => v !== '');
  },

  // Helper: converte array in stringa separata da virgola
  joinMultiValue: (values: string[]): string => {
    return values.join(',');
  },
};
