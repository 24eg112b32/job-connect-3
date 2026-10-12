import axios from 'axios';

const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim();

export const api = axios.create({
  // Local development uses the same-origin Express API. In production, set
  // VITE_API_BASE_URL to the deployed backend URL ending in /api.
  baseURL: configuredApiBaseUrl || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and global 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired token if 401 returned
      const hadToken = localStorage.getItem('jobconnect_token');
      if (hadToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('jobconnect_token');
        localStorage.removeItem('jobconnect_user');
      }
    }
    return Promise.reject(error);
  }
);
