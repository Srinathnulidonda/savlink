// src/services/links.service.js
import api from '../utils/api';

export const linksService = {
  // Get links with filters
  getLinks: async (params = {}) => {
    return await api.get('/api/links', params);
  },

  // Get single link
  getLink: async (linkId) => {
    return await api.get(`/api/links/${linkId}`);
  },

  // Create new link
  createLink: async (linkData) => {
    return await api.post('/api/links', linkData);
  },

  // Update link
  updateLink: async (linkId, updates) => {
    return await api.patch(`/api/links/${linkId}`, updates);
  },

  // Delete link
  deleteLink: async (linkId) => {
    return await api.delete(`/api/links/${linkId}`);
  },

  // Pin/unpin link
  pinLink: async (linkId) => {
    return await api.post(`/api/links/${linkId}/pin`);
  },

  unpinLink: async (linkId) => {
    return await api.post(`/api/links/${linkId}/unpin`);
  },

  togglePin: async (linkId) => {
    return await api.post(`/api/links/${linkId}/toggle-pin`);
  },

  // Archive/restore link
  archiveLink: async (linkId) => {
    return await api.post(`/api/links/${linkId}/archive`);
  },

  restoreLink: async (linkId) => {
    return await api.post(`/api/links/${linkId}/restore`);
  },

  toggleArchive: async (linkId) => {
    return await api.post(`/api/links/${linkId}/toggle-archive`);
  },

  // Toggle active status
  toggleActive: async (linkId) => {
    return await api.post(`/api/links/${linkId}/toggle-active`);
  },

  // Check duplicate
  checkDuplicate: async (url) => {
    return await api.post('/api/links/check-duplicate', { original_url: url });
  },

  // Move to folder
  moveToFolder: async (linkId, folderId) => {
    return await api.post(`/api/links/${linkId}/move-folder`, { 
      folder_id: folderId 
    });
  },

  // Bulk move to folder
  bulkMoveToFolder: async (linkIds, folderId) => {
    return await Promise.all(
      linkIds.map(id => linksService.moveToFolder(id, folderId))
    );
  },

  // Add tags to link
  addTags: async (linkId, tagIds) => {
    return await api.post(`/api/links/${linkId}/add-tags`, { 
      tag_ids: tagIds 
    });
  },

  // Remove tags from link
  removeTags: async (linkId, tagIds) => {
    return await api.post(`/api/links/${linkId}/remove-tags`, { 
      tag_ids: tagIds 
    });
  },

  // Bulk operations
  bulkDelete: async (linkIds) => {
    return await Promise.all(
      linkIds.map(id => linksService.deleteLink(id))
    );
  },

  bulkPin: async (linkIds) => {
    return await Promise.all(
      linkIds.map(id => linksService.pinLink(id))
    );
  },

  bulkUnpin: async (linkIds) => {
    return await Promise.all(
      linkIds.map(id => linksService.unpinLink(id))
    );
  },

  bulkArchive: async (linkIds) => {
    return await Promise.all(
      linkIds.map(id => linksService.archiveLink(id))
    );
  },

  bulkRestore: async (linkIds) => {
    return await Promise.all(
      linkIds.map(id => linksService.restoreLink(id))
    );
  },

  // Star/unstar (if backend supports it)
  toggleStar: async (linkId) => {
    return await api.post(`/api/links/${linkId}/toggle-star`);
  },

  // Mark as frequently used
  toggleFrequentlyUsed: async (linkId) => {
    return await api.post(`/api/links/${linkId}/toggle-frequently-used`);
  },

  // Fetch metadata for URL
  fetchMetadata: async (url) => {
    try {
      const result = await api.post('/api/metadata/extract', { 
        url,
        force_refresh: false 
      });
      return result?.data?.metadata || {};
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      return {};
    }
  },

  // Refresh link metadata
  refreshMetadata: async (linkId) => {
    return await api.post(`/api/metadata/refresh/${linkId}`);
  },

  // Get link statistics
  getLinkStats: async (linkId) => {
    return await api.get(`/api/links/${linkId}/stats`);
  },

  // Get expiring links
  getExpiringLinks: async (days = 7) => {
    return await api.get('/api/links', {
      view: 'expiring_soon',
      days
    });
  },

  // Extend link expiry
  extendExpiry: async (linkId, days) => {
    return await api.post(`/api/links/${linkId}/extend-expiry`, { days });
  },

  // Set link expiry
  setExpiry: async (linkId, expiresAt) => {
    return await api.patch(`/api/links/${linkId}`, { 
      expires_at: expiresAt 
    });
  },

  // Remove link expiry
  removeExpiry: async (linkId) => {
    return await api.patch(`/api/links/${linkId}`, { 
      expires_at: null 
    });
  }
};

export const LinksService = linksService;