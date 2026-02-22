// services/links.service.js
import apiService from '../utils/api';
import { config } from '../config/config';

class LinksService {
  async createLink(data) {
    try {
      const response = await apiService.post(config.endpoints.links.base, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data?.link || response.data
        };
      }
      
      throw new Error(response.error || 'Failed to create link');
    } catch (error) {
      console.error('Create link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create link'
      };
    }
  }

  async updateLink(id, data) {
    try {
      const response = await apiService.put(`${config.endpoints.links.base}/${id}`, data);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data?.link || response.data
        };
      }
      
      throw new Error(response.error || 'Failed to update link');
    } catch (error) {
      console.error('Update link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update link'
      };
    }
  }

  async deleteLink(id) {
    try {
      const response = await apiService.delete(`${config.endpoints.links.base}/${id}`);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to delete link');
    } catch (error) {
      console.error('Delete link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete link'
      };
    }
  }

  async pinLink(id) {
    try {
      const response = await apiService.post(`${config.endpoints.links.base}/${id}/pin`);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to pin link');
    } catch (error) {
      console.error('Pin link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to pin link'
      };
    }
  }

  async unpinLink(id) {
    try {
      const response = await apiService.delete(`${config.endpoints.links.base}/${id}/pin`);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to unpin link');
    } catch (error) {
      console.error('Unpin link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to unpin link'
      };
    }
  }

  async archiveLink(id) {
    try {
      const response = await apiService.post(`${config.endpoints.links.base}/${id}/archive`);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to archive link');
    } catch (error) {
      console.error('Archive link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to archive link'
      };
    }
  }

  async restoreLink(id) {
    try {
      const response = await apiService.delete(`${config.endpoints.links.base}/${id}/archive`);
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to restore link');
    } catch (error) {
      console.error('Restore link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to restore link'
      };
    }
  }

  async bulkDelete(ids) {
    try {
      const response = await apiService.post(`${config.endpoints.links.base}/bulk/delete`, { ids });
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to delete links');
    } catch (error) {
      console.error('Bulk delete error:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete links'
      };
    }
  }

  async bulkArchive(ids) {
    try {
      const response = await apiService.post(`${config.endpoints.links.base}/bulk/archive`, { ids });
      
      if (response.success) {
        return { success: true };
      }
      
      throw new Error(response.error || 'Failed to archive links');
    } catch (error) {
      console.error('Bulk archive error:', error);
      return {
        success: false,
        error: error.message || 'Failed to archive links'
      };
    }
  }

  async fetchMetadata(url) {
    try {
      const response = await apiService.post('/api/tools/fetch-metadata', { url });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data.data || {}
        };
      }
      
      throw new Error(response.error || 'Failed to fetch metadata');
    } catch (error) {
      console.error('Fetch metadata error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch metadata'
      };
    }
  }
}

export default new LinksService();