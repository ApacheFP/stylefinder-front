import axios from 'axios';

// Create axios instance with base configuration
// Backend uses Flask-Login with cookie-based sessions
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 60000, // 1 minute - AI outfit generation can take time
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: send cookies with requests for Flask-Login sessions
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login (but not if already on login/signup page)
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
