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

// ============================================================================
// PROPERTY TYPES & STATUS
// ============================================================================

export const PROPERTY_TYPES = ['residential', 'commercial', 'luxury'] as const;
export const PROPERTY_STATUS = ['available', 'sold', 'rented'] as const;

// ============================================================================
// PORTAL-SPECIFIC ENUMS
// ============================================================================

export const PORTAL_NAMES = ['property_finder', 'bayut', 'dubizzle'] as const;

export const FURNISHING_TYPES = ['unfurnished', 'semi-furnished', 'furnished'] as const;
export const FURNISHING_TYPES_LABELS: Record<string, string> = {
  'unfurnished': 'Unfurnished',
  'semi-furnished': 'Semi-Furnished',
  'furnished': 'Furnished',
};

export const COMPLIANCE_TYPES = ['rera', 'dtcm', 'adrec'] as const;
export const COMPLIANCE_TYPES_LABELS: Record<string, string> = {
  'rera': 'RERA',
  'dtcm': 'DTCM',
  'adrec': 'ADREC',
};

export const PROJECT_STATUS = ['completed', 'off_plan', 'completed_primary', 'off_plan_primary'] as const;
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  'completed': 'Completed',
  'off_plan': 'Off Plan',
  'completed_primary': 'Completed Primary',
  'off_plan_primary': 'Off Plan Primary',
};

export const PRICE_TYPES = ['sale', 'yearly', 'monthly', 'weekly', 'daily'] as const;
export const PRICE_TYPES_LABELS: Record<string, string> = {
  'sale': 'Sale',
  'yearly': 'Yearly Rent',
  'monthly': 'Monthly Rent',
  'weekly': 'Weekly Rent',
  'daily': 'Daily Rent',
};

// ============================================================================
// AMENITIES
// ============================================================================

export const AMENITIES = [
  { code: 'central-ac', labelEn: 'Central AC', labelAr: 'تكييف مركزي', category: 'Climate Control' },
  { code: 'built-in-wardrobes', labelEn: 'Built-in Wardrobes', labelAr: 'خزائن مدمجة', category: 'Storage' },
  { code: 'kitchen-appliances', labelEn: 'Kitchen Appliances', labelAr: 'أجهزة المطبخ', category: 'Kitchen' },
  { code: 'security', labelEn: 'Security', labelAr: 'الأمن', category: 'Safety' },
  { code: 'concierge', labelEn: 'Concierge', labelAr: 'موظف الاستقبال', category: 'Services' },
  { code: 'maid-service', labelEn: 'Maid Service', labelAr: 'خدمة التنظيف', category: 'Services' },
  { code: 'balcony', labelEn: 'Balcony', labelAr: 'شرفة', category: 'Outdoor' },
  { code: 'private-gym', labelEn: 'Private Gym', labelAr: 'صالة ألعاب خاصة', category: 'Recreation' },
  { code: 'shared-gym', labelEn: 'Shared Gym', labelAr: 'صالة ألعاب مشتركة', category: 'Recreation' },
  { code: 'private-jacuzzi', labelEn: 'Private Jacuzzi', labelAr: 'حوض استحمام خاص', category: 'Recreation' },
  { code: 'shared-spa', labelEn: 'Shared Spa', labelAr: 'منتجع صحي مشترك', category: 'Recreation' },
  { code: 'covered-parking', labelEn: 'Covered Parking', labelAr: 'موقف سيارات مغطى', category: 'Parking' },
  { code: 'maids-room', labelEn: 'Maids Room', labelAr: 'غرفة الخادمة', category: 'Rooms' },
  { code: 'study', labelEn: 'Study', labelAr: 'دراسة', category: 'Rooms' },
  { code: 'childrens-play-area', labelEn: "Children's Play Area", labelAr: 'منطقة لعب الأطفال', category: 'Recreation' },
  { code: 'pets-allowed', labelEn: 'Pets Allowed', labelAr: 'الحيوانات الأليفة مسموح بها', category: 'Policies' },
  { code: 'barbecue-area', labelEn: 'Barbecue Area', labelAr: 'منطقة الشواء', category: 'Outdoor' },
  { code: 'shared-pool', labelEn: 'Shared Pool', labelAr: 'حمام سباحة مشترك', category: 'Recreation' },
  { code: 'childrens-pool', labelEn: "Children's Pool", labelAr: 'حمام السباحة للأطفال', category: 'Recreation' },
  { code: 'private-garden', labelEn: 'Private Garden', labelAr: 'حديقة خاصة', category: 'Outdoor' },
  { code: 'private-pool', labelEn: 'Private Pool', labelAr: 'حمام سباحة خاص', category: 'Recreation' },
  { code: 'view-of-water', labelEn: 'View of Water', labelAr: 'إطلالة على الماء', category: 'Views' },
  { code: 'view-of-landmark', labelEn: 'View of Landmark', labelAr: 'إطلالة على معالم سياحية', category: 'Views' },
  { code: 'walk-in-closet', labelEn: 'Walk-in Closet', labelAr: 'خزانة مدمجة', category: 'Storage' },
  { code: 'lobby-in-building', labelEn: 'Lobby in Building', labelAr: 'بهو في المبنى', category: 'Common Areas' },
  { code: 'vastu-compliant', labelEn: 'Vastu Compliant', labelAr: 'متوافق مع فاستو', category: 'Special' },
  { code: 'networked', labelEn: 'Networked', labelAr: 'متصل بالشبكة', category: 'Technology' },
  { code: 'dining-in-building', labelEn: 'Dining in Building', labelAr: 'تناول الطعام في المبنى', category: 'Services' },
  { code: 'conference-room', labelEn: 'Conference Room', labelAr: 'غرفة المؤتمرات', category: 'Business' },
] as const;

// ============================================================================
// PORTAL REQUIREMENTS
// ============================================================================

export const PORTAL_REQUIREMENTS: Record<string, string[]> = {
  'property_finder': [
    'titleEn',
    'descriptionEn',
    'size',
    'price',
    'priceType',
    'portalConfigs.property_finder.locationId',
  ],
  'bayut': [
    'titleEn',
    'descriptionEn',
    'size',
    'price',
    'priceType',
    'portalConfigs.bayut.locationId',
  ],
  'dubizzle': [
    'titleEn',
    'descriptionEn',
    'size',
    'price',
    'priceType',
    'portalConfigs.dubizzle.locationId',
  ],
};

// ============================================================================
// PORTAL STATUS LABELS
// ============================================================================

export const PORTAL_STATUS_LABELS: Record<string, string> = {
  'draft': 'Draft',
  'published': 'Published',
  'pending': 'Pending',
  'error': 'Error',
};

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  PROPERTIES: '/properties',
  AGENTS: '/agents',
  DASHBOARD: '/dashboard',
  PORTAL_LOCATIONS: '/properties/portal-locations',
  PROPERTY_PUBLISH: '/properties/:id/publish',
  PROPERTY_ENHANCE: '/properties/:id/enhance',
} as const;

// ============================================================================
// UI CONFIG
// ============================================================================

export const UI_CONFIG = {
  toastDuration: 3000,
  debounceDelay: 300,
  animationDuration: 200,
} as const;

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  PORTAL_LOCATION_REQUIRED: 'Portal location ID is required for publishing to this portal.',
  PORTAL_NOT_READY: 'Property is not portal-enhanced. Please complete enhancement first.',
  IMAGE_UPLOAD_FAILED: 'Failed to upload images. Please try again.',
} as const;

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  CREATED: 'Successfully created.',
  UPDATED: 'Successfully updated.',
  PUBLISHED: 'Successfully published to portal.',
  ENHANCED: 'Property successfully enhanced for portal publishing.',
  DELETED: 'Successfully deleted.',
} as const;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_PROPERTY_VALUES = {
  furnishingType: 'unfurnished' as const,
  complianceType: 'rera' as const,
  projectStatus: 'completed' as const,
  priceType: 'monthly' as const,
  parkingSlots: 0,
  isPortalEnhanced: false,
  amenities: [] as string[],
} as const;
