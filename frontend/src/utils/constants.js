// src/utils/constants.js
// Application constants

export const APP_NAME = 'Savlink';
export const APP_VERSION = '3.0.0';
export const APP_DESCRIPTION = 'Save once. Use forever.';

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const API_TIMEOUT = 30000; // 30 seconds

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  VIEW_MODE: 'view_mode',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
  PREFERENCES: 'preferences'
};

// Link types
export const LINK_TYPES = {
  SAVED: 'saved',
  SHORTENED: 'shortened'
};

// View modes
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

// Sort options
export const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Last Modified' },
  { value: 'created_at', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'click_count', label: 'Most Clicked' }
];

// Date range options
export const DATE_RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'lastWeek', label: 'Last Week' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'last7Days', label: 'Last 7 Days' },
  { value: 'last30Days', label: 'Last 30 Days' },
  { value: 'last90Days', label: 'Last 90 Days' }
];

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  LIMITS: [10, 20, 50, 100]
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Themes
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
};

// Modal types
export const MODAL_TYPES = {
  ADD_LINK: 'add-link',
  EDIT_LINK: 'edit-link',
  MOVE_FOLDER: 'move-folder',
  CREATE_FOLDER: 'create-folder',
  CREATE_TAG: 'create-tag',
  CONFIRM: 'confirm',
  SHARE: 'share'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Resource not found.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  RATE_LIMIT: 'Too many requests. Please try again later.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LINK_CREATED: 'Link saved successfully!',
  LINK_UPDATED: 'Link updated successfully!',
  LINK_DELETED: 'Link deleted successfully!',
  FOLDER_CREATED: 'Folder created successfully!',
  FOLDER_UPDATED: 'Folder updated successfully!',
  FOLDER_DELETED: 'Folder deleted successfully!',
  TAG_CREATED: 'Tag created successfully!',
  TAG_UPDATED: 'Tag updated successfully!',
  TAG_DELETED: 'Tag deleted successfully!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!'
};

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: 'cmd+k',
  ADD_LINK: 'cmd+n',
  SEARCH: 'cmd+f',
  TOGGLE_VIEW: 'cmd+shift+v',
  SELECT_ALL: 'cmd+a',
  DELETE: 'delete',
  ESCAPE: 'escape'
};

// Animation durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Default colors
export const COLORS = {
  PRIMARY: '#113CCF',
  PRIMARY_LIGHT: '#2851E3',
  SUCCESS: '#22C55E',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712'
  }
};

// External services
export const EXTERNAL_SERVICES = {
  FAVICON: 'https://www.google.com/s2/favicons',
  QR_CODE: 'https://api.qrserver.com/v1/create-qr-code'
};

// Features flags
export const FEATURES = {
  ENABLE_2FA: false,
  ENABLE_TEAMS: false,
  ENABLE_API_KEYS: false,
  ENABLE_WEBHOOKS: false,
  ENABLE_BILLING: false,
  ENABLE_ANALYTICS_EXPORT: true,
  ENABLE_BULK_IMPORT: true,
  ENABLE_PUBLIC_PROFILES: false
};

// Export formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  HTML: 'html',
  MARKDOWN: 'markdown'
};

// Import sources
export const IMPORT_SOURCES = {
  BROWSER: 'browser',
  POCKET: 'pocket',
  INSTAPAPER: 'instapaper',
  RAINDROP: 'raindrop',
  PINBOARD: 'pinboard',
  CSV: 'csv',
  JSON: 'json'
};