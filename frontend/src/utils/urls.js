// src/utils/urls.js
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
};

export const normalizeUrl = (url) => {
  if (!url) return '';
  
  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  
  try {
    const urlObj = new URL(url);
    
    // Remove trailing slash from pathname
    if (urlObj.pathname.endsWith('/') && urlObj.pathname !== '/') {
      urlObj.pathname = urlObj.pathname.slice(0, -1);
    }
    
    // Sort query parameters for consistency
    const params = new URLSearchParams(urlObj.search);
    const sortedParams = new URLSearchParams([...params].sort());
    urlObj.search = sortedParams.toString();
    
    return urlObj.toString();
  } catch (error) {
    return url;
  }
};

export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./i, '');
  } catch (error) {
    return '';
  }
};

export const extractDisplayUrl = (url) => {
  try {
    const urlObj = new URL(url);
    let display = urlObj.hostname.replace(/^www\./i, '');
    
    if (urlObj.pathname && urlObj.pathname !== '/') {
      display += urlObj.pathname;
    }
    
    // Truncate if too long
    if (display.length > 50) {
      display = display.substring(0, 47) + '...';
    }
    
    return display;
  } catch (error) {
    return url;
  }
};

export const buildFaviconUrl = (url) => {
  const domain = extractDomain(url);
  if (!domain) return null;
  
  // Multiple favicon services for fallback
  const services = [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    `https://favicon.ico.la/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`
  ];
  
  return services[0]; // Use Google as primary
};

export const getUrlParams = (url) => {
  try {
    const urlObj = new URL(url);
    const params = {};
    
    for (const [key, value] of urlObj.searchParams) {
      params[key] = value;
    }
    
    return params;
  } catch (error) {
    return {};
  }
};

export const appendUtmParams = (url, utmParams) => {
  try {
    const urlObj = new URL(url);
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(`utm_${key}`, value);
      }
    });
    
    return urlObj.toString();
  } catch (error) {
    return url;
  }
};

export const removeQueryParams = (url) => {
  try {
    const urlObj = new URL(url);
    urlObj.search = '';
    return urlObj.toString();
  } catch (error) {
    return url;
  }
};

export const isInternalUrl = (url, baseUrl) => {
  try {
    const urlObj = new URL(url);
    const baseObj = new URL(baseUrl);
    return urlObj.hostname === baseObj.hostname;
  } catch (error) {
    return false;
  }
};

export const generateSlug = (length = 7) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return slug;
};

export const validateSlug = (slug) => {
  // Only lowercase letters, numbers, and hyphens
  // Must start and end with letter or number
  // At least 3 characters
  return /^[a-z0-9][a-z0-9-]{1,}[a-z0-9]$/.test(slug);
};