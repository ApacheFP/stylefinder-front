import api from './api';
import type { LoginCredentials, SignUpData, AuthResponse } from '../types';

/**
 * Authentication Service
 * 
 * NOTE FOR BACKEND TEAM:
 * These functions are ready to connect to your API endpoints.
 * The base URL is set in .env (VITE_API_BASE_URL)
 * See BACKEND_INTEGRATION.md for detailed API specifications.
 */

export const authService = {
  // Login user
  // Backend endpoint: POST /auth/login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    // Save token to localStorage
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  },

  // Sign up new user
  // Backend endpoint: POST /auth/signup
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    // Save token to localStorage
    localStorage.setItem('authToken', response.data.token);
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Get current user
  // Backend endpoint: GET /auth/me
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
