// src/services/folders.service.js
import api from '../utils/api';

export const foldersService = {
  // Get all folders
  getFolders: async () => {
    return await api.get('/api/folders');
  },

  // Get folder tree
  getFolderTree: async () => {
    return await api.get('/api/folders', { view: 'tree' });
  },

  // Get single folder
  getFolder: async (folderId) => {
    return await api.get(`/api/folders/${folderId}`);
  },

  // Create folder
  createFolder: async (folderData) => {
    return await api.post('/api/folders', folderData);
  },

  // Update folder
  updateFolder: async (folderId, updates) => {
    return await api.put(`/api/folders/${folderId}`, updates);
  },

  // Delete folder
  deleteFolder: async (folderId) => {
    return await api.delete(`/api/folders/${folderId}`);
  },

  // Restore folder
  restoreFolder: async (folderId) => {
    return await api.post(`/api/folders/${folderId}/restore`);
  },

  // Pin/unpin folder
  togglePin: async (folderId) => {
    return await api.post(`/api/folders/${folderId}/pin`);
  },

  // Move folder
  moveFolder: async (folderId, parentId) => {
    return await api.post(`/api/folders/${folderId}/move`, { 
      parent_id: parentId 
    });
  },

  // Get folder analytics
  getFolderAnalytics: async (folderId) => {
    return await api.get(`/api/folders/${folderId}/analytics`);
  },

  // Get merge suggestions
  getMergeSuggestions: async () => {
    return await api.get('/api/folders/merge-suggestions');
  },

  // Bulk organize links
  bulkOrganize: async (rules) => {
    return await api.post('/api/folders/bulk-organize', { rules });
  },

  // Create folder with auto-categorization
  createSmartFolder: async (folderData) => {
    return await api.post('/api/folders', {
      ...folderData,
      auto_categorize: true
    });
  },

  // Get folder statistics
  getFolderStats: async (folderId) => {
    const analytics = await foldersService.getFolderAnalytics(folderId);
    return analytics?.data?.analytics || {};
  },

  // Check folder name availability
  checkFolderName: async (name, excludeId = null) => {
    const folders = await foldersService.getFolders();
    const exists = folders?.data?.folders?.some(folder => 
      folder.name.toLowerCase() === name.toLowerCase() && 
      folder.id !== excludeId
    );
    return !exists;
  }
};

export const FoldersService = foldersService;