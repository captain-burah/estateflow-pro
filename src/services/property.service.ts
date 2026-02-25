/**
 * Property Service
 * Handles all property-related database operations via Supabase
 */

import { supabase } from '@/lib/supabase'
import { apiClient } from '@/lib/api-client'
import type { Property, PaginatedResponse } from '@/types'

interface PropertyFilters {
  page?: number
  pageSize?: number
  type?: string
  city?: string
  status?: string
}

export const propertyService = {
  /**
   * Fetch all properties with optional filtering and pagination
   */
  async getProperties(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })

      if (filters?.type) query = query.eq('type', filters.type)
      if (filters?.city) query = query.eq('city', filters.city)
      if (filters?.status) query = query.eq('status', filters.status)

      const page = filters?.page || 1
      const pageSize = filters?.pageSize || 20
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, count, error } = await query.range(from, to)

      if (error) throw error

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  /**
   * Fetch a single property by ID
   */
  async getProperty(id: string): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new property
   */
  async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    try {
      const { data: property, error } = await supabase
        .from('properties')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return property
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  },

  /**
   * Update an existing property
   */
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error updating property ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete a property
   */
  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error)
      throw error
    }
  },

  /**
   * Search properties by various criteria
   */
  async searchProperties(query: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%`)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },

  /**
   * Subscribe to real-time property updates
   */
  subscribeToProperties(callback: (properties: Property[]) => void) {
    const subscription = supabase
      .from('properties')
      .on('*', (payload) => {
        callback(payload.new as Property)
      })
      .subscribe()

    return subscription
  },

  /**
   * Get properties by company ID
   */
  async getPropertiesByCompany(companyId: string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('company_id', companyId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error fetching properties for company ${companyId}:`, error)
      throw error
    }
  },

  /**
   * Get featured properties
   */
  async getFeaturedProperties(limit = 10): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('featured', true)
        .eq('status', 'available')
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured properties:', error)
      throw error
    }
  },

  /**
   * Save draft changes to a property (does not trigger approval workflow)
   */
  async saveDraftChanges(id: string, changes: Partial<Property>, editedBy: string): Promise<Property> {
    try {
      const response = await apiClient.post<Property>(`/properties/${id}/draft-changes`, {
        changes,
        editedBy,
      })
      return response.data
    } catch (error) {
      console.error(`Error saving draft changes for property ${id}:`, error)
      throw error
    }
  },

  /**
   * Submit property changes for admin approval
   */
  async submitForApproval(id: string): Promise<Property> {
    try {
      const response = await apiClient.post<Property>(`/properties/${id}/submit-approval`)
      return response.data
    } catch (error) {
      console.error(`Error submitting property ${id} for approval:`, error)
      throw error
    }
  },

  /**
   * Approve property edits (admin only)
   */
  async approvePropertyEdits(id: string): Promise<Property> {
    try {
      const response = await apiClient.patch<Property>(`/properties/${id}/approve`)
      return response.data
    } catch (error) {
      console.error(`Error approving property ${id}:`, error)
      throw error
    }
  },

  /**
   * Reject property edits with reason (admin only)
   */
  async rejectPropertyEdits(id: string, reason: string): Promise<Property> {
    try {
      const response = await apiClient.patch<Property>(`/properties/${id}/reject`, {
        reason,
      })
      return response.data
    } catch (error) {
      console.error(`Error rejecting property ${id}:`, error)
      throw error
    }
  },

  /**
   * Get pending property approvals (admin only)
   */
  async getPendingApprovals(): Promise<Property[]> {
    try {
      const response = await apiClient.get<Property[]>('/properties/approvals/pending')
      return response.data || []
    } catch (error) {
      console.error('Error fetching pending approvals:', error)
      throw error
    }
  },
}
