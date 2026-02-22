// frontend/src/utils/urls.js
export const urlUtils = {
  // Extract domain from URL
  getDomain: (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  },

  // Validate URL format
  isValid: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Add protocol if missing
  normalize: (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  },

  // Shorten URL for display
  truncate: (url, maxLength = 50) => {
    if (!url || url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  },

  // Extract favicon URL
  getFaviconUrl: (url) => {
    try {
      const domain = urlUtils.getDomain(url);
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  },

  // Check if URL is secure
  isSecure: (url) => {
    try {
      return new URL(url).protocol === 'https:';
    } catch {
      return false;
    }
  },

  // Parse URL parts
  parse: (url) => {
    try {
      const parsed = new URL(url);
      return {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        port: parsed.port
      };
    } catch {
      return null;
    }
  }
};