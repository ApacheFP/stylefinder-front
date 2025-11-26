import api from './api';
import type { LoginCredentials, SignUpData, User } from '../types';

/**
 * Authentication Service
 * 
 * Backend uses Flask-Login with cookie-based sessions (not JWT).
 * Endpoints:
 *   POST /user/login - Login
 *   POST /user/ - Signup
 *   GET /user/session - Check session
 *   GET /user/logout - Logout
 */

interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    preferences: Record<string, unknown>;
  };
}

interface SignupResponse {
  success: boolean;
}

interface SessionResponse {
  success: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    preferences: Record<string, unknown>;
  };
}

// Helper to transform backend user to frontend User type
const transformUser = (backendUser: LoginResponse['user']): User => ({
  id: String(backendUser.id),
  name: backendUser.name || backendUser.email.split('@')[0], // Use name from backend, fallback to email prefix
  email: backendUser.email,
  preferences: backendUser.preferences as unknown as User['preferences'],
});

export const authService = {
  // Login user
  // Backend endpoint: POST /user/login
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<LoginResponse>('/user/login', credentials);
    return {
      user: transformUser(response.data.user),
    };
  },

  // Sign up new user
  // Backend endpoint: POST /user/
  signUp: async (data: SignUpData) => {
    // Send name, email and password to backend
    await api.post<SignupResponse>('/user/', {
      name: data.name,
      email: data.email,
      password: data.password,
    });
    
    // After signup, automatically login to get session
    const loginResponse = await api.post<LoginResponse>('/user/login', {
      email: data.email,
      password: data.password,
    });
    
    return {
      user: transformUser(loginResponse.data.user),
    };
  },

  // Logout user
  // Backend endpoint: GET /user/logout
  logout: async () => {
    try {
      await api.get('/user/logout');
    } catch (error) {
      // Ignore errors on logout (user might already be logged out)
      console.warn('Logout request failed:', error);
    }
  },

  // Get current user / Check session
  // Backend endpoint: GET /user/session
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<SessionResponse>('/user/session');
    return transformUser(response.data.user);
  },
};
