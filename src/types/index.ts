/**
 * Central type definitions for the application
 */

// Common types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Property types
export interface Property extends BaseEntity {
  // Basic Information
  title: string;
  titleAr?: string;
  category: 'rental' | 'sale' | 'luxury';
  status: 'available' | 'reserved' | 'sold' | 'rented';
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agent: string;
  publishedPortals: string[];
  image?: string;
  description?: string;
  descriptionAr?: string;
  
  // Portal Enhancement Fields
  furnishingType?: 'unfurnished' | 'semi-furnished' | 'furnished';
  size?: number; // size in sqft
  propertyAge?: number; // age in years
  availableFrom?: Date;
  complianceType?: 'rera' | 'dtcm' | 'adrec';
  listingAdvertisementNumber?: string;
  projectStatus?: 'completed' | 'off_plan' | 'completed_primary' | 'off_plan_primary';
  developer?: string;
  unitNumber?: string;
  floorNumber?: string;
  parkingSlots?: number;
  downpayment?: number;
  numberOfCheques?: number;
  priceType?: 'sale' | 'yearly' | 'monthly' | 'weekly' | 'daily';
  
  // Portal Configurations
  portalConfigs?: Array<{
    portal: 'property_finder' | 'bayut' | 'dubizzle';
    isActive: boolean;
    locationId?: string;
    locationFullName?: string;
    publishedAt?: Date;
    lastSyncedAt?: Date;
    portalStatus: 'draft' | 'published' | 'pending' | 'error';
    validationErrors?: string[];
  }>;
  
  // Amenities and Media
  amenities?: string[]; // Array of amenity codes
  imagesMetadata?: Array<{
    url: string;
    originalName: string;
    width?: number;
    height?: number;
    fileSize?: number;
    isVertical?: boolean;
    order: number;
    uploadedAt: Date;
  }>;
  
  // Agent Assignment
  assignedAgentId?: string;
  
  // Portal Enhancement Status
  isPortalEnhanced?: boolean;
  portalEnhancementCompletedAt?: Date;
  portalEnhancementCompletedBy?: string;
  
  // Approval Status
  approvalStatus: 'approved' | 'pending' | 'rejected';
  pendingChanges?: Record<string, any>;
  editedBy?: string;
  editedAt?: Date;
  rejectionReason?: string;
}

// Agent types
export interface Agent extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  salesCount: number;
  totalRevenue: number;
  rating: number;
}

// Dashboard types
export interface DashboardStats {
  totalRevenue: number;
  rentalRevenue: number;
  luxuryInventory: number;
  publishedListings: number;
  activeAgents: number;
  totalProperties: number;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// User/Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'user';
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}
