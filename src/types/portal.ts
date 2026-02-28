/**
 * Portal-specific type definitions
 * Types for third-party portal integration (PropertyFinder, Bayut, dubizzle)
 */

/**
 * Supported portal names
 */
export type PortalName = 'property_finder' | 'bayut' | 'dubizzle';

/**
 * Portal publish status
 */
export type PortalStatus = 'draft' | 'published' | 'pending' | 'error';

/**
 * Individual portal configuration for a property
 */
export interface PortalConfig {
  portal: PortalName;
  isActive: boolean;
  locationId?: string; // Portal-specific location ID
  locationFullName?: string; // Human-readable location name
  publishedAt?: Date;
  lastSyncedAt?: Date;
  portalStatus: PortalStatus;
  validationErrors?: string[]; // List of issues preventing publish
}

/**
 * Furnishing type for properties
 */
export type FurnishingType = 'unfurnished' | 'semi-furnished' | 'furnished';

/**
 * Compliance/licensing type
 */
export type ComplianceType = 'rera' | 'dtcm' | 'adrec';

/**
 * Project development status
 */
export type ProjectStatus = 'completed' | 'off_plan' | 'completed_primary' | 'off_plan_primary';

/**
 * Price type for listings (sale vs rental periods)
 */
export type PriceType = 'sale' | 'yearly' | 'monthly' | 'weekly' | 'daily';

/**
 * Image metadata for property photos
 */
export interface ImageMetadata {
  url: string;
  originalName: string;
  width?: number;
  height?: number;
  fileSize?: number; // in bytes
  isVertical?: boolean; // Indicates if image is portrait orientation
  order: number;
  uploadedAt: Date;
}

/**
 * Complete list of available amenities
 */
export enum AmenityOption {
  CENTRAL_AC = 'central-ac',
  BUILT_IN_WARDROBES = 'built-in-wardrobes',
  KITCHEN_APPLIANCES = 'kitchen-appliances',
  SECURITY = 'security',
  CONCIERGE = 'concierge',
  MAID_SERVICE = 'maid-service',
  BALCONY = 'balcony',
  PRIVATE_GYM = 'private-gym',
  SHARED_GYM = 'shared-gym',
  PRIVATE_JACUZZI = 'private-jacuzzi',
  SHARED_SPA = 'shared-spa',
  COVERED_PARKING = 'covered-parking',
  MAIDS_ROOM = 'maids-room',
  STUDY = 'study',
  CHILDRENS_PLAY_AREA = 'childrens-play-area',
  PETS_ALLOWED = 'pets-allowed',
  BARBECUE_AREA = 'barbecue-area',
  SHARED_POOL = 'shared-pool',
  CHILDRENS_POOL = 'childrens-pool',
  PRIVATE_GARDEN = 'private-garden',
  PRIVATE_POOL = 'private-pool',
  VIEW_OF_WATER = 'view-of-water',
  VIEW_OF_LANDMARK = 'view-of-landmark',
  WALK_IN_CLOSET = 'walk-in-closet',
  LOBBY_IN_BUILDING = 'lobby-in-building',
  VASTU_COMPLIANT = 'vastu-compliant',
  NETWORKED = 'networked',
  DINING_IN_BUILDING = 'dining-in-building',
  CONFERENCE_ROOM = 'conference-room',
}

/**
 * Portal-specific location option (from autocomplete search)
 */
export interface PortalLocation {
  id: string;
  name: string; // English name
  nameAr?: string; // Arabic name
  portal: PortalName;
}

/**
 * Result from location search API
 */
export interface LocationSearchResult {
  locations: PortalLocation[];
  totalCount: number;
}

/**
 * Enhancement metadata for a property
 */
export interface PortalEnhancementMetadata {
  isEnhanced: boolean;
  completedAt?: Date;
  completedBy?: string; // User ID who completed enhancement
  lastSyncedAt?: Date;
}

/**
 * Validation error for property portal publishing
 */
export interface PortalValidationError {
  field: string;
  message: string;
  portal?: PortalName; // If portal-specific
}

/**
 * Property portal readiness check result
 */
export interface PortalReadinessCheck {
  isReadyForPortal: boolean;
  portal: PortalName;
  missingFields: string[];
  validationErrors: PortalValidationError[];
  canPublish: boolean;
}

/**
 * Amenity with label for display
 */
export interface AmenityDisplay {
  code: string;
  labelEn: string;
  labelAr?: string;
  category?: string;
}

/**
 * Portal location mapping for a property
 */
export interface PropertyPortalLocationMapping {
  propertyId: string;
  propertyFinder?: {
    locationId: string;
    locationFullName: string;
  };
  bayut?: {
    locationId: string;
    locationFullName: string;
  };
  dubizzle?: {
    locationId: string;
    locationFullName: string;
  };
}
