// src/utils/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
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

    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
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

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          message = 'Session expired. Please login again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'Resource not found';
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
    }

    // Show error toast for non-401 errors
    if (status !== 401) {
      toast.error(message);
    }

    return {
      success: false,
      error: message,
      status,
      data: null,
    };
  }
);

// API methods
const apiService = {
  // GET request
  get: async (url, params = {}) => {
    return await api.get(url, { params });
  },

  // POST request
  post: async (url, data = {}) => {
    return await api.post(url, data);
  },

  // PUT request
  put: async (url, data = {}) => {
    return await api.put(url, data);
  },

  // PATCH request
  patch: async (url, data = {}) => {
    return await api.patch(url, data);
  },

  // DELETE request
  delete: async (url) => {
    return await api.delete(url);
  },

  // Upload file
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

  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

export default apiService;