import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  // Basic Information
  title: string;
  titleAr?: string;
  category: 'rental' | 'sale' | 'luxury';
  status: 'available' | 'reserved' | 'sold' | 'rented';
  price: number;
  priceType?: 'sale' | 'yearly' | 'monthly' | 'weekly' | 'daily';
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  agent: string;
  image?: string;
  description?: string;
  descriptionAr?: string;
  
  // Portal Enhancement Fields
  furnishingType?: 'unfurnished' | 'semi-furnished' | 'furnished';
  size?: number;
  propertyAge?: number;
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
  
  // Portal Configurations
  publishedPortals: string[];
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
  amenities?: string[];
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
  
  // Approval Workflow
  approvalStatus: 'approved' | 'pending' | 'rejected';
  pendingChanges?: Record<string, unknown>;
  editedBy?: string;
  editedAt?: Date;
  rejectionReason?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Helper methods
  getPortalConfig(portalName: string): IProperty['portalConfigs'] extends Array<infer T> ? T | null : null;
  setPortalConfig(portalName: string, config: Partial<IProperty['portalConfigs'] extends Array<infer T> ? T : unknown>): void;
  getPortalValidationStatus(): Record<string, string[]>;
  markAsPortalEnhanced(userId: string): void;
  canPublishToPortal(portalName: string): boolean;
}

const portalConfigSchema = new Schema({
  portal: { type: String, enum: ['property_finder', 'bayut', 'dubizzle'], required: true },
  isActive: { type: Boolean, default: false },
  locationId: String,
  locationFullName: String,
  publishedAt: Date,
  lastSyncedAt: Date,
  portalStatus: { type: String, enum: ['draft', 'published', 'pending', 'error'], default: 'draft' },
  validationErrors: { type: [String], default: [] },
}, { _id: false });

const imageMetadataSchema = new Schema({
  url: { type: String, required: true },
  originalName: String,
  width: Number,
  height: Number,
  fileSize: Number,
  isVertical: Boolean,
  order: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

const propertySchema = new Schema<IProperty>(
  {
    // Basic Information
    title: { type: String, required: true },
    titleAr: String,
    category: { type: String, enum: ['rental', 'sale', 'luxury'], required: true },
    status: { type: String, enum: ['available', 'reserved', 'sold', 'rented'], required: true },
    price: { type: Number, required: true },
    priceType: { type: String, enum: ['sale', 'yearly', 'monthly', 'weekly', 'daily'] },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    agent: { type: String, required: true },
    image: String,
    description: String,
    descriptionAr: String,
    
    // Portal Enhancement Fields
    furnishingType: { type: String, enum: ['unfurnished', 'semi-furnished', 'furnished'], default: 'unfurnished' },
    size: Number,
    propertyAge: Number,
    availableFrom: { type: Date, default: () => new Date() },
    complianceType: { type: String, enum: ['rera', 'dtcm', 'adrec'], default: 'rera' },
    listingAdvertisementNumber: String,
    projectStatus: { type: String, enum: ['completed', 'off_plan', 'completed_primary', 'off_plan_primary'], default: 'completed' },
    developer: String,
    unitNumber: String,
    floorNumber: String,
    parkingSlots: { type: Number, default: 0 },
    downpayment: Number,
    numberOfCheques: Number,
    
    // Portal Configurations
    publishedPortals: { type: [String], default: [] },
    portalConfigs: { type: [portalConfigSchema], default: [] },
    
    // Amenities and Media
    amenities: { type: [String], default: [] },
    imagesMetadata: { type: [imageMetadataSchema], default: [] },
    
    // Agent Assignment
    assignedAgentId: String,
    
    // Portal Enhancement Status
    isPortalEnhanced: { type: Boolean, default: false },
    portalEnhancementCompletedAt: Date,
    portalEnhancementCompletedBy: String,
    
    // Approval Workflow
    approvalStatus: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
    pendingChanges: { type: Schema.Types.Mixed, default: null },
    editedBy: String,
    editedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

// Add indexes for portal features
propertySchema.index({ isPortalEnhanced: 1 });
propertySchema.index({ publishedPortals: 1 });
propertySchema.index({ 'portalConfigs.portal': 1 });
propertySchema.index({ furnishingType: 1 });
propertySchema.index({ complianceType: 1 });
propertySchema.index({ projectStatus: 1 });

// Helper method: Get portal config
propertySchema.methods.getPortalConfig = function(portalName: string) {
  return this.portalConfigs?.find((c) => c.portal === portalName) || null;
};

// Helper method: Set portal config
propertySchema.methods.setPortalConfig = function(portalName: string, config: Record<string, unknown>) {
  const existing = this.portalConfigs?.findIndex((c) => c.portal === portalName);
  if (existing !== undefined && existing >= 0) {
    this.portalConfigs[existing] = { ...this.portalConfigs[existing], ...config };
  } else {
    this.portalConfigs = [...(this.portalConfigs || []), { ...config, portal: portalName }];
  }
};

// Helper method: Get portal validation status
propertySchema.methods.getPortalValidationStatus = function() {
  const status: Record<string, string[]> = {};
  this.portalConfigs?.forEach((config) => {
    status[config.portal] = config.validationErrors || [];
  });
  return status;
};

// Helper method: Mark as portal enhanced
propertySchema.methods.markAsPortalEnhanced = function(userId: string) {
  this.isPortalEnhanced = true;
  this.portalEnhancementCompletedAt = new Date();
  this.portalEnhancementCompletedBy = userId;
};

// Helper method: Check if can publish to portal
propertySchema.methods.canPublishToPortal = function(portalName: string): boolean {
  if (!this.title || !this.description) {
    return false;
  }
  if (!this.area || !this.price || !this.priceType) {
    return false;
  }
  const portalConfig = this.getPortalConfig(portalName);
  if (!portalConfig?.locationId) {
    return false;
  }
  return true;
};

export const Property = mongoose.model<IProperty>('Property', propertySchema);
