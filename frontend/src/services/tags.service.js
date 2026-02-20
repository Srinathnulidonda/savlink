// src/services/tags.service.js
import api from '../utils/api';

export const tagsService = {
  // Get all tags
  getTags: async () => {
    return await api.get('/api/tags');
  },

  // Create tag
  createTag: async (tagData) => {
    return await api.post('/api/tags', tagData);
  },

  // Update tag
  updateTag: async (tagId, updates) => {
    return await api.put(`/api/tags/${tagId}`, updates);
  },

  // Delete tag
  deleteTag: async (tagId) => {
    return await api.delete(`/api/tags/${tagId}`);
  },

  // Get tags with usage counts
  getTagsWithCounts: async () => {
    const result = await api.get('/api/tags');
    return result?.data?.tags || [];
  },

  // Get suggested tags for a URL
  getSuggestedTags: async (url) => {
    try {
      const result = await api.post('/api/tags/suggest', { url });
      return result?.data?.suggestions || [];
    } catch (error) {
      console.error('Failed to get tag suggestions:', error);
      return [];
    }
  },

  // Check tag name availability
  checkTagName: async (name, excludeId = null) => {
    const tags = await tagsService.getTags();
    const exists = tags?.data?.tags?.some(tag => 
      tag.name.toLowerCase() === name.toLowerCase() && 
      tag.id !== excludeId
    );
    return !exists;
  },

  // Merge tags
  mergeTags: async (sourceTagId, targetTagId) => {
    return await api.post(`/api/tags/${sourceTagId}/merge`, {
      target_tag_id: targetTagId
    });
  },

  // Bulk create tags
  bulkCreateTags: async (tagNames) => {
    const results = await Promise.all(
      tagNames.map(name => tagsService.createTag({ name }))
    );
    return results.filter(r => r?.success);
  }
};

export const TagsService = tagsService;