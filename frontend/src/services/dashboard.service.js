// src/services/dashboard.service.js
import api from '../utils/api';

export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    return await api.get('/api/dashboard/stats');
  },

  // Get dashboard structure (folders + system folders)
  getStructure: async () => {
    return await api.get('/api/dashboard/structure');
  },

  // Get dashboard links with filters
  getLinks: async (params = {}) => {
    return await api.get('/api/dashboard/links', params);
  },

  // Get pinned links
  getPinnedLinks: async () => {
    return await api.get('/api/dashboard/links', {
      view: 'pinned',
      limit: 50
    });
  },

  // Get recent activity
  getRecentActivity: async (limit = 20) => {
    return await api.get('/api/dashboard/links', {
      view: 'recent',
      limit
    });
  },

  // Get trending links
  getTrending: async () => {
    return await api.get('/api/dashboard/links', {
      view: 'trending',
      limit: 20
    });
  },

  // Get expired links
  getExpiredLinks: async () => {
    return await api.get('/api/dashboard/links', {
      view: 'expired',
      limit: 50
    });
  },

  // Get links by folder
  getLinksByFolder: async (folderId, params = {}) => {
    return await api.get('/api/dashboard/links', {
      ...params,
      folder_id: folderId
    });
  },

  // Get unassigned links
  getUnassignedLinks: async (params = {}) => {
    return await api.get('/api/dashboard/links', {
      ...params,
      unassigned_only: true
    });
  },

  // Get links by tag
  getLinksByTag: async (tagIds, params = {}) => {
    return await api.get('/api/dashboard/links', {
      ...params,
      tag_ids: Array.isArray(tagIds) ? tagIds.join(',') : tagIds
    });
  },

  // Search links
  searchLinks: async (query, params = {}) => {
    return await api.get('/api/dashboard/links', {
      ...params,
      search: query
    });
  },

  // Get view counts
  getViewCounts: async () => {
    const result = await api.get('/api/dashboard/stats');
    return result?.data?.stats?.counts || {};
  },

  // Get domain statistics
  getDomainStats: async () => {
    const result = await api.get('/api/dashboard/stats');
    return result?.data?.stats?.top_domains || [];
  },

  // Get activity timeline
  getActivityTimeline: async (days = 30) => {
    const result = await api.get('/api/dashboard/stats');
    return result?.data?.stats?.activity || [];
  }
};

export const DashboardService = dashboardService;