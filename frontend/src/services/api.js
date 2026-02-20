// src/services/api.js
import { AuthService } from '../auth/services/auth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add auth token if available
        const token = AuthService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);

            // Handle non-JSON responses
            if (!response.headers.get('content-type')?.includes('application/json')) {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return { success: true, data: await response.text() };
            }

            const data = await response.json();

            // Handle API errors
            if (!response.ok) {
                const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
                
                // Handle token expiration
                if (response.status === 401) {
                    AuthService.logout();
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }

                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            // Network errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            
            throw error;
        }
    }

    // HTTP Methods
    get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET',
        });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    // File upload helper
    upload(endpoint, formData) {
        const token = AuthService.getToken();
        const headers = {};
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: formData, // Don't set Content-Type for FormData
        });
    }
}

export const apiClient = new ApiClient();
export default apiClient;