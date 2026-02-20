// src/utils/dates.js
import {
  formatDistanceToNow,
  format,
  parseISO,
  isValid,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  addDays,
  addHours,
  addMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear
} from 'date-fns';

export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInMinutes = differenceInMinutes(now, dateObj);
    const diffInHours = differenceInHours(now, dateObj);
    const diffInDays = differenceInDays(now, dateObj);
    
    // Less than 1 minute
    if (diffInMinutes < 1) {
      return 'just now';
    }
    
    // Less than 1 hour
    if (diffInHours < 1) {
      return `${diffInMinutes}m ago`;
    }
    
    // Less than 24 hours
    if (diffInDays < 1) {
      return `${diffInHours}h ago`;
    }
    
    // Less than 7 days
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    // Less than 30 days
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks}w ago`;
    }
    
    // Less than 365 days
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months}mo ago`;
    }
    
    // More than a year
    const years = Math.floor(diffInDays / 365);
    return `${years}y ago`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM d, yyyy h:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'h:mm a');
};

export const getDateRangeLabel = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    if (isToday(dateObj)) {
      return 'Today';
    }
    
    if (isYesterday(dateObj)) {
      return 'Yesterday';
    }
    
    if (isThisWeek(dateObj)) {
      return 'This week';
    }
    
    if (isThisMonth(dateObj)) {
      return 'This month';
    }
    
    if (isThisYear(dateObj)) {
      return format(dateObj, 'MMMM');
    }
    
    return format(dateObj, 'MMMM yyyy');
  } catch (error) {
    console.error('Error getting date range label:', error);
    return '';
  }
};

export const parseDuration = (duration) => {
  // Parse durations like "7d", "24h", "30m"
  const match = duration.match(/^(\d+)([hdwmy])$/);
  
  if (!match) {
    return null;
  }
  
  const [, amount, unit] = match;
  const now = new Date();
  
  switch (unit) {
    case 'h':
      return addHours(now, parseInt(amount));
    case 'd':
      return addDays(now, parseInt(amount));
    case 'w':
      return addDays(now, parseInt(amount) * 7);
    case 'm':
      return addDays(now, parseInt(amount) * 30);
    case 'y':
      return addDays(now, parseInt(amount) * 365);
    default:
      return null;
  }
};

export const getDateRangeFilter = (range) => {
  const now = new Date();
  
  switch (range) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday':
      const yesterday = addDays(now, -1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    case 'thisWeek':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'lastWeek':
      const lastWeek = addDays(now, -7);
      return { start: startOfWeek(lastWeek), end: endOfWeek(lastWeek) };
    case 'thisMonth':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'lastMonth':
      const lastMonth = addDays(now, -30);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    case 'last7Days':
      return { start: addDays(now, -7), end: now };
    case 'last30Days':
      return { start: addDays(now, -30), end: now };
    case 'last90Days':
      return { start: addDays(now, -90), end: now };
    default:
      return null;
  }
};

export const timeAgo = formatRelativeDate; // Alias for backward compatibility