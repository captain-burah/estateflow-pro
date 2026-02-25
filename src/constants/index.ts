/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'EstateFlow Pro',
  version: import.meta.env.VITE_APP_VERSION || '0.0.1',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
};

export const ROUTES = {
  DASHBOARD: '/',
  PROPERTIES: '/properties',
  NOT_FOUND: '*',
} as const;

export const PROPERTY_TYPES = ['residential', 'commercial', 'luxury'] as const;
export const PROPERTY_STATUS = ['available', 'sold', 'rented'] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const API_ENDPOINTS = {
  PROPERTIES: '/properties',
  AGENTS: '/agents',
  DASHBOARD: '/dashboard',
} as const;

export const UI_CONFIG = {
  toastDuration: 3000,
  debounceDelay: 300,
  animationDuration: 200,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  DELETED: 'Successfully deleted.',
  LOADED: 'Data loaded successfully.',
} as const;
