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
  title: string;
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
