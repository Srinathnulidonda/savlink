// src/services/search.service.js
import api from '../utils/api';

export const searchService = {
  // Global search
  search: async (params = {}) => {
    return await api.get('/api/search', params);
  },

  // Search links
  searchLinks: async (query, options = {}) => {
    return await api.get('/api/search/links', {
      q: query,
      ...options
    });
  },

  // Search folders
  searchFolders: async (query) => {
    return await api.get('/api/search/folders', { q: query });
  },

  // Search tags
  searchTags: async (query) => {
    return await api.get('/api/search/tags', { q: query });
  },

  // Get search suggestions
  getSuggestions: async (query) => {
    return await api.get('/api/search/suggestions', { q: query });
  },

  // Get trending searches
  getTrendingSearches: async () => {
    return await api.get('/api/search/trending');
  },

  // Save search (for search history)
  saveSearch: async (query) => {
    return await api.post('/api/search/history', { query });
  },

  // Get search history
  getSearchHistory: async (limit = 10) => {
    return await api.get('/api/search/history', { limit });
  },

  // Clear search history
  clearSearchHistory: async () => {
    return await api.delete('/api/search/history');
  },

  // Advanced search with filters
  advancedSearch: async (filters) => {
    return await api.post('/api/search/advanced', filters);
  }
};

export const SearchService = searchService;