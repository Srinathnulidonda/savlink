// src/services/user.service.js
import api from '../utils/api';

export const userService = {
  // Get current user profile
  getProfile: async () => {
    return await api.get('/api/user/profile');
  },

  // Update profile
  updateProfile: async (updates) => {
    return await api.patch('/api/user/profile', updates);
  },

  // Upload avatar
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return await api.upload('/api/user/avatar', formData);
  },

  // Delete avatar
  deleteAvatar: async () => {
    return await api.delete('/api/user/avatar');
  },

  // Get user settings
  getSettings: async () => {
    return await api.get('/api/user/settings');
  },

  // Update settings
  updateSettings: async (settings) => {
    return await api.patch('/api/user/settings', settings);
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await api.post('/api/user/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
  },

  // Enable two-factor authentication
  enable2FA: async () => {
    return await api.post('/api/user/2fa/enable');
  },

  // Disable two-factor authentication
  disable2FA: async (code) => {
    return await api.post('/api/user/2fa/disable', { code });
  },

  // Get sessions
  getSessions: async () => {
    return await api.get('/api/user/sessions');
  },

  // Revoke session
  revokeSession: async (sessionId) => {
    return await api.delete(`/api/user/sessions/${sessionId}`);
  },

  // Get notifications preferences
  getNotificationPreferences: async () => {
    return await api.get('/api/user/notifications');
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    return await api.patch('/api/user/notifications', preferences);
  },

  // Delete account
  deleteAccount: async (password) => {
    return await api.post('/api/user/delete-account', { password });
  },

  // Export user data
  exportUserData: async (format = 'json') => {
    return await api.get('/api/user/export', { format });
  },

  // Get usage statistics
  getUsageStats: async () => {
    return await api.get('/api/user/stats');
  },

  // Get subscription info (if applicable)
  getSubscription: async () => {
    return await api.get('/api/user/subscription');
  }
};

export const UserService = userService;