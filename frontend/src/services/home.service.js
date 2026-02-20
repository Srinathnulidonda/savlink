// src/services/home.service.js
import api from '../utils/api';

export const homeService = {
  // Get quick access items (pinned links and folders)
  getQuickAccess: async () => {
    return await api.get('/api/dashboard/home/quick-access');
  },

  // Get recent activity for home
  getRecentActivity: async () => {
    return await api.get('/api/dashboard/home/recent');
  },

  // Get home dashboard stats
  getHomeStats: async () => {
    return await api.get('/api/dashboard/home/stats');
  },

  // Get all home data in one request
  getHomeDashboard: async () => {
    try {
      const [quickAccess, recent, stats] = await Promise.all([
        homeService.getQuickAccess(),
        homeService.getRecentActivity(),
        homeService.getHomeStats()
      ]);

      return {
        success: true,
        data: {
          quickAccess: quickAccess?.data?.items || [],
          recentActivity: recent?.data?.activities || [],
          stats: stats?.data?.stats || {}
        }
      };
    } catch (error) {
      console.error('Failed to fetch home dashboard:', error);
      return {
        success: false,
        error: 'Failed to load dashboard data',
        data: {
          quickAccess: [],
          recentActivity: [],
          stats: {}
        }
      };
    }
  },

  // Mark link as accessed (for frequency tracking)
  markLinkAccessed: async (linkId) => {
    return await api.post(`/api/links/${linkId}/accessed`);
  }
};

export const HomeService = homeService;