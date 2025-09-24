import { CURRENCY, DATE_FORMATS } from '../constants';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
  }).format(amount);
};

/**
 * Format date string
 */
export const formatDate = (dateString: string, format: keyof typeof DATE_FORMATS = 'SHORT'): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const options: Intl.DateTimeFormatOptions = {};
  
  switch (format) {
    case 'SHORT':
      options.month = 'short';
      options.day = 'numeric';
      options.year = 'numeric';
      break;
    case 'LONG':
      options.month = 'long';
      options.day = 'numeric';
      options.year = 'numeric';
      break;
    case 'TIME':
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.hour12 = true;
      break;
    case 'DATETIME':
      options.month = 'short';
      options.day = 'numeric';
      options.year = 'numeric';
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.hour12 = true;
      break;
    case 'ISO':
      return date.toISOString().split('T')[0];
  }

  return date.toLocaleDateString(CURRENCY.LOCALE, options);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(value);
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format status for display
 */
export const formatStatus = (status: string): string => {
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Format time string
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Time';
  }

  return date.toLocaleTimeString(CURRENCY.LOCALE, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};
