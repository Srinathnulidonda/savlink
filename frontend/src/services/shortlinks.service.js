// src/services/shortlinks.service.js
import api from '../utils/api';

export const shortLinksService = {
  // Get short links
  getShortLinks: async (params = {}) => {
    return await api.get('/api/shortlinks', params);
  },

  // Create short link
  createShortLink: async (linkData) => {
    return await api.post('/api/shortlinks', linkData);
  },

  // Update short link
  updateShortLink: async (linkId, updates) => {
    return await api.patch(`/api/shortlinks/${linkId}`, updates);
  },

  // Delete short link
  deleteShortLink: async (linkId) => {
    return await api.delete(`/api/shortlinks/${linkId}`);
  },

  // Get short link analytics
  getAnalytics: async (linkId, period = '7d') => {
    return await api.get(`/api/shortlinks/${linkId}/analytics`, { period });
  },

  // Get click details
  getClickDetails: async (linkId, params = {}) => {
    return await api.get(`/api/shortlinks/${linkId}/clicks`, params);
  },

  // Check slug availability
  checkSlug: async (slug) => {
    return await api.get('/api/shortlinks/check-slug', { slug });
  },

  // Generate slug
  generateSlug: async () => {
    return await api.post('/api/shortlinks/generate-slug');
  },

  // Toggle password protection
  togglePassword: async (linkId, password = null) => {
    return await api.post(`/api/shortlinks/${linkId}/toggle-password`, { 
      password 
    });
  },

  // Update UTM parameters
  updateUTMParams: async (linkId, utmParams) => {
    return await api.patch(`/api/shortlinks/${linkId}`, { 
      utm_params: utmParams 
    });
  },

  // Set click limit
  setClickLimit: async (linkId, limit) => {
    return await api.patch(`/api/shortlinks/${linkId}`, { 
      click_limit: limit 
    });
  },

  // Get QR code
  getQRCode: async (linkId, options = {}) => {
    const params = new URLSearchParams({
      size: options.size || 200,
      format: options.format || 'png',
      ...options
    });
    return `/api/shortlinks/${linkId}/qr?${params}`;
  },

  // Bulk create short links
  bulkCreate: async (links) => {
    return await api.post('/api/shortlinks/bulk', { links });
  },

  // Export short links
  exportShortLinks: async (format = 'csv') => {
    return await api.get('/api/shortlinks/export', { format });
  }
};

export const ShortLinksService = shortLinksService;