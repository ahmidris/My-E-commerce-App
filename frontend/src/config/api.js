// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// For development, use HTTP
// For production with SSL, use HTTPS
// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-domain.com';

export const apiConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};
