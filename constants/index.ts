// Application Constants
export const APP_CONFIG = {
  NAME: 'DentalCare Management System',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive dental practice management solution',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  SKELETON_COUNT: 6,
  ITEMS_PER_PAGE: 10,
  MAX_SEARCH_RESULTS: 50,
} as const;

// Status Types
export const STATUS_TYPES = {
  PATIENT: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    NEW: 'New',
    DISCHARGED: 'Discharged',
  },
  APPOINTMENT: {
    SCHEDULED: 'Scheduled',
    CONFIRMED: 'Confirmed',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show',
  },
  INVOICE: {
    DRAFT: 'Draft',
    SENT: 'Sent',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
  },
  PRESCRIPTION: {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
  },
  MESSAGE: {
    DRAFT: 'draft',
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    FAILED: 'failed',
  },
  DOCTOR: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ON_LEAVE: 'on_leave',
  },
  SERVICE: {
    ACTIVE: true,
    INACTIVE: false,
  },
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Message Types
export const MESSAGE_TYPES = {
  APPOINTMENT: 'appointment',
  REMINDER: 'reminder',
  FOLLOW_UP: 'follow_up',
  EMERGENCY: 'emergency',
  GENERAL: 'general',
} as const;

// Communication Channels
export const COMMUNICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  PHONE: 'phone',
  IN_APP: 'in_app',
} as const;

// Service Categories
export const SERVICE_CATEGORIES = {
  PREVENTIVE: 'Preventive',
  RESTORATIVE: 'Restorative',
  COSMETIC: 'Cosmetic',
  SURGICAL: 'Surgical',
  ORTHODONTIC: 'Orthodontic',
  EMERGENCY: 'Emergency',
} as const;

// Doctor Specialties
export const DOCTOR_SPECIALTIES = {
  GENERAL_DENTISTRY: 'General Dentistry',
  ORTHODONTICS: 'Orthodontics',
  ORAL_SURGERY: 'Oral Surgery',
  PERIODONTICS: 'Periodontics',
  ENDODONTICS: 'Endodontics',
  PROSTHODONTICS: 'Prosthodontics',
  PEDIATRIC_DENTISTRY: 'Pediatric Dentistry',
} as const;

// System Health Levels
export const SYSTEM_HEALTH = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  WARNING: 'warning',
  CRITICAL: 'critical',
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM dd, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
} as const;

// Currency
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be no more than ${max} characters`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SENT: 'Message sent successfully',
  SCHEDULED: 'Appointment scheduled successfully',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  LOADING: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  SENDING: 'Sending...',
  PROCESSING: 'Processing...',
} as const;

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  NO_PATIENTS: 'No patients found',
  NO_APPOINTMENTS: 'No appointments found',
  NO_INVOICES: 'No invoices found',
  NO_PRESCRIPTIONS: 'No prescriptions found',
  NO_SERVICES: 'No services found',
  NO_MESSAGES: 'No messages found',
  NO_DOCTORS: 'No doctors found',
  NO_DATA: 'No data available',
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#10B981',
  SUCCESS: '#059669',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#06B6D4',
  PURPLE: '#8B5CF6',
  PINK: '#EC4899',
  GRAY: '#6B7280',
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;
