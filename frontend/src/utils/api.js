// src/utils/api.js - Add better debugging

import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with proper base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://savlinks-test-g445.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching for GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime(),
      };
    }

    // Log the request for debugging
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
        params: config.params,
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses in dev
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }

    // Transform response to consistent format
    if (response.data) {
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    }
    return response;
  },
  (error) => {
    // Handle errors
    let message = 'An error occurred';
    let status = 500;

    if (error.response) {
      // Server responded with error
      status = error.response.status;
      message = error.response.data?.error || 
                error.response.data?.message || 
                `Error ${status}`;

      // Log error details in dev
      if (import.meta.env.DEV) {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status,
          message,
          data: error.response.data,
          baseURL: error.config?.baseURL
        });
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          console.warn('🔓 Authentication failed - clearing token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          message = 'Session expired. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'Resource not found - API endpoint may not exist yet';
          break;
        case 429:
          message = 'Too many requests. Please try again later.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      // Request sent but no response
      message = 'Network error. Please check your connection.';
      console.error('📡 Network error:', error.request);
      console.error('API Base URL:', api.defaults.baseURL);
    } else {
      // Something else happened
      console.error('🔥 Request setup error:', error.message);
    }

    // Show error toast for non-401 errors (auth context will handle 401)
    if (status !== 401) {
      // Don't show toast for network errors in development (using mocks)
      if (!(status === 500 && import.meta.env.DEV)) {
        toast.error(message);
      }
    }

    return {
      success: false,
      error: message,
      status,
      data: null,
    };
  }
);

// Rest of your API service methods remain the same...

const apiService = {
  get: async (url, params = {}) => {
    return await api.get(url, { params });
  },

  post: async (url, data = {}) => {
    return await api.post(url, data);
  },

  put: async (url, data = {}) => {
    return await api.put(url, data);
  },

  patch: async (url, data = {}) => {
    return await api.patch(url, data);
  },

  delete: async (url) => {
    return await api.delete(url);
  },

  upload: async (url, formData, onProgress) => {
    return await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },

  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Auth token set');
    } else {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      console.log('🔓 Auth token removed');
    }
  },

  removeAuthToken: () => {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
    console.log('🔓 Auth token cleared');
  },

  getAuthToken: () => {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  getBaseUrl: () => {
    return api.defaults.baseURL;
  }
};

export default apiService;