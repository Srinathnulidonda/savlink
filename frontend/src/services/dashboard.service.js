// services/dashboard.service.js
import apiService from '../utils/api';
import { config } from '../config/config';

class DashboardService {
  async getHomeData() {
    try {
      const response = await apiService.get(config.endpoints.dashboard.home);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            pinnedLinks: response.data.data?.pinned_links || [],
            recentLinks: response.data.data?.recent_links || [],
            folders: response.data.data?.folders || [],
            stats: response.data.data?.stats || {},
            activity: response.data.data?.activity || []
          }
        };
      }
      
      throw new Error(response.error || 'Failed to fetch home data');
    } catch (error) {
      console.error('Dashboard service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard data'
      };
    }
  }

  async getStats() {
    try {
      const response = await apiService.get(config.endpoints.dashboard.stats);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data?.stats || {}
        };
      }
      
      throw new Error(response.error || 'Failed to fetch stats');
    } catch (error) {
      console.error('Stats service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch stats'
      };
    }
  }

  async getLinks(params = {}) {
    try {
      const {
        view = 'all',
        search = '',
        cursor = null,
        limit = 20,
        sort = 'created_at',
        order = 'desc'
      } = params;

      const queryParams = {
        view,
        limit,
        sort,
        order,
        ...(search && { search }),
        ...(cursor && { cursor })
      };

      const response = await apiService.get(config.endpoints.dashboard.links, queryParams);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            links: response.data.data?.links || [],
            cursor: response.data.data?.cursor || null,
            hasMore: response.data.data?.has_more || false,
            total: response.data.data?.total || 0
          }
        };
      }
      
      throw new Error(response.error || 'Failed to fetch links');
    } catch (error) {
      console.error('Links service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch links'
      };
    }
  }

  async searchLinks(query) {
    try {
      const response = await apiService.get(config.endpoints.links.search, { q: query });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data?.results || []
        };
      }
      
      throw new Error(response.error || 'Search failed');
    } catch (error) {
      console.error('Search service error:', error);
      return {
        success: false,
        error: error.message || 'Search failed'
      };
    }
  }

  async getActivity(limit = 10) {
    try {
      const response = await apiService.get('/api/dashboard/activity', { limit });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data?.activity || []
        };
      }
      
      throw new Error(response.error || 'Failed to fetch activity');
    } catch (error) {
      console.error('Activity service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch activity'
      };
    }
  }
}

export default new DashboardService();