// frontend/src/utils/constants.js
export const LINK_TYPES = {
  SAVED: 'saved',
  SHORTENED: 'shortened'
};

export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
};

export const VIEWS = {
  HOME: 'home',
  ALL: 'all',
  RECENT: 'recent',
  STARRED: 'starred',
  ARCHIVE: 'archive'
};

export const KEYBOARD_SHORTCUTS = {
  SEARCH: 'k',
  ADD_LINK: 'n',
  COMMAND_PALETTE: 'k'
};

export const LIMITS = {
  FREE_LINKS: 100,
  PRO_LINKS: 10000,
  TAGS_PER_LINK: 5,
  COLLECTIONS_FREE: 3,
  COLLECTIONS_PRO: 50
};

export const COLORS = {
  PRIMARY: '#113CCF',
  PRIMARY_LIGHT: '#3B82F6'
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

export const API_ENDPOINTS = {
  LINKS: '/api/links',
  DASHBOARD: '/api/dashboard',
  USER: '/api/user',
  AUTH: '/auth'
};