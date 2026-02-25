/**
 * Form validation utilities using Zod schemas
 */

import { z } from 'zod';

// Property validation schema
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
