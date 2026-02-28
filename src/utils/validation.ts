/**
 * Form validation utilities using Zod schemas
 */

import { z } from 'zod';
import type { PortalValidationError } from '@/types/portal';

// ============================================================================
// PROPERTY VALIDATION SCHEMAS
// ============================================================================

// Basic property schema for legacy properties
export const propertySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  emirate: z.string().min(2, 'Emirate must be selected'),
  priceAED: z.number().positive('Price must be greater than 0'),
  type: z.enum(['residential', 'commercial', 'luxury']),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  area: z.number().positive('Area must be greater than 0'),
  status: z.enum(['available', 'sold', 'rented']),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// ============================================================================
// PORTAL PROPERTY VALIDATION SCHEMA
// ============================================================================

// Portal-enhanced property schema (new properties with full portal support)
export const portalPropertySchema = z.object({
  // Basic Information
  titleEn: z.string().min(3, 'Title must be at least 3 characters').max(255),
  titleAr: z.string().max(255).optional().nullable(),
  category: z.enum(['residential', 'commercial'], { errorMap: () => ({ message: 'Category is required' }) }),
  type: z.string().min(1, 'Property type is required'),
  furnishingType: z.enum(['unfurnished', 'semi-furnished', 'furnished'], {
    errorMap: () => ({ message: 'Furnishing type is required' }),
  }),
  
  // Location & Size
  location: z.string().min(3, 'Location is required'),
  size: z.number().positive('Size must be greater than 0'),
  bedrooms: z.number().int().nonnegative('Bedrooms must be a positive number'),
  bathrooms: z.number().nonnegative('Bathrooms must be a positive number'),
  propertyAge: z.number().int().nonnegative().optional(),
  availableFrom: z.date().optional(),
  
  // Description
  descriptionEn: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  descriptionAr: z.string().max(5000).optional().nullable(),
  
  // Pricing
  priceType: z.enum(['sale', 'yearly', 'monthly', 'weekly', 'daily'], {
    errorMap: () => ({ message: 'Price type is required' }),
  }),
  price: z.number().positive('Price must be greater than 0'),
  downpayment: z.number().nonnegative().optional(),
  numberOfCheques: z.number().int().nonnegative().optional(),
  
  // Compliance
  complianceType: z.enum(['rera', 'dtcm', 'adrec']).default('rera'),
  listingAdvertisementNumber: z.string().max(255).optional(),
  
  // Additional Info
  projectStatus: z.enum(['completed', 'off_plan', 'completed_primary', 'off_plan_primary']).default('completed'),
  developer: z.string().max(255).optional(),
  unitNumber: z.string().max(100).optional(),
  floorNumber: z.string().max(100).optional(),
  parkingSlots: z.number().int().nonnegative().default(0),
  
  // Portal Configuration
  publishedPortals: z.array(z.enum(['property_finder', 'bayut', 'dubizzle'])).default([]),
  portalConfigs: z.array(z.object({
    portal: z.enum(['property_finder', 'bayut', 'dubizzle']),
    isActive: z.boolean(),
    locationId: z.string().optional(),
    locationFullName: z.string().optional(),
  })).optional(),
  
  // Amenities
  amenities: z.array(z.string()).default([]),
  
  // Agent Assignment
  assignedAgentId: z.string().uuid().optional(),
});

export type PortalPropertyFormData = z.infer<typeof portalPropertySchema>;

// ============================================================================
// PORTAL LOCATION VALIDATION
// ============================================================================

export const portalLocationSchema = z.object({
  id: z.string().min(1, 'Location ID is required'),
  name: z.string().min(1, 'Location name is required'),
  nameAr: z.string().optional(),
  portal: z.enum(['property_finder', 'bayut', 'dubizzle']),
});

// ============================================================================
// PORTAL ENHANCEMENT SCHEMA
// ============================================================================

export const portalEnhancementSchema = z.object({
  propertyId: z.string().uuid(),
  furnishingType: z.enum(['unfurnished', 'semi-furnished', 'furnished']),
  complianceType: z.enum(['rera', 'dtcm', 'adrec']),
  listingAdvertisementNumber: z.string().max(255).optional(),
  projectStatus: z.enum(['completed', 'off_plan', 'completed_primary', 'off_plan_primary']).optional(),
  amenities: z.array(z.string()).default([]),
  portalLocations: z.record(z.object({
    locationId: z.string(),
    locationFullName: z.string(),
  })).optional(),
});

export type PortalEnhancementData = z.infer<typeof portalEnhancementSchema>;

// ============================================================================
// BULK ENHANCEMENT SCHEMA
// ============================================================================

export const bulkPortalEnhancementSchema = z.object({
  propertyIds: z.array(z.string().uuid()).min(1, 'At least one property must be selected'),
  furnishingType: z.enum(['unfurnished', 'semi-furnished', 'furnished']).optional(),
  complianceType: z.enum(['rera', 'dtcm', 'adrec']).optional(),
  amenities: z.array(z.string()).default([]),
  projectStatus: z.enum(['completed', 'off_plan', 'completed_primary', 'off_plan_primary']).optional(),
});

export type BulkEnhancementData = z.infer<typeof bulkPortalEnhancementSchema>;

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// Pagination validation schema
export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  pageSize: z.number().positive().max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Phone validation (basic pattern for international numbers)
export const phoneSchema = z.string().regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number');

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

// Helper function to validate and format errors
export const validateFormData = <T,>(schema: z.ZodSchema, data: unknown): { data?: T; errors?: Record<string, string> } => {
  try {
    const validated = schema.parse(data);
    return { data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { errors };
    }
    return { errors: { form: 'Validation failed' } };
  }
};

// ============================================================================
// PORTAL-SPECIFIC VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate if a property is ready to publish to a specific portal
 */
export const validatePropertyForPortalPublish = (
  property: any,
  portal: string,
): PortalValidationError[] => {
  const errors: PortalValidationError[] = [];

  // Common required fields for all portals
  if (!property.titleEn || property.titleEn.length < 3) {
    errors.push({ field: 'titleEn', message: 'English title is required' });
  }
  if (!property.descriptionEn || property.descriptionEn.length < 10) {
    errors.push({ field: 'descriptionEn', message: 'English description is required' });
  }
  if (!property.size || property.size <= 0) {
    errors.push({ field: 'size', message: 'Property size is required' });
  }
  if (!property.price || property.price <= 0) {
    errors.push({ field: 'price', message: 'Price is required' });
  }
  if (!property.priceType) {
    errors.push({ field: 'priceType', message: 'Price type is required' });
  }

  // Portal-specific location requirement
  const portalConfig = property.portalConfigs?.find((c: any) => c.portal === portal);
  if (!portalConfig?.locationId) {
    errors.push({
      field: 'locationId',
      message: `${portal} location ID is required`,
      portal: portal as any,
    });
  }

  return errors;
};

/**
 * Validate portal configurations
 */
export const validatePortalConfigs = (portalConfigs: any): PortalValidationError[] => {
  const errors: PortalValidationError[] = [];

  if (!Array.isArray(portalConfigs)) {
    return errors;
  }

  portalConfigs.forEach((config: any) => {
    if (!config.portal) {
      errors.push({
        field: 'portal',
        message: 'Portal name is required',
      });
    }
    if (config.isActive && !config.locationId) {
      errors.push({
        field: 'locationId',
        message: `Portal ${config.portal} is active but missing location ID`,
        portal: config.portal,
      });
    }
  });

  return errors;
};

/**
 * Check if a property needs portal enhancement
 */
export const isPropertyNeedsEnhancement = (property: any): boolean => {
  return (
    !property.isPortalEnhanced &&
    property.publishedPortals &&
    property.publishedPortals.length > 0
  );
};

/**
 * Validate multi-language content
 */
export const validateMultiLanguageContent = (
  titleEn: string,
  descriptionEn: string,
  titleAr?: string,
  descriptionAr?: string,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!titleEn || titleEn.length < 3) {
    errors.titleEn = 'English title is required and must be at least 3 characters';
  }
  if (!descriptionEn || descriptionEn.length < 10) {
    errors.descriptionEn = 'English description is required and must be at least 10 characters';
  }

  // Arabic is optional, but if provided, should meet minimum length
  if (titleAr && titleAr.length > 0 && titleAr.length < 3) {
    errors.titleAr = 'Arabic title must be at least 3 characters';
  }
  if (descriptionAr && descriptionAr.length > 0 && descriptionAr.length < 10) {
    errors.descriptionAr = 'Arabic description must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
