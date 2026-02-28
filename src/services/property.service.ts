/**
 * Property Service
 * Handles all property-related database operations via Supabase
 */

import { supabase } from '@/lib/supabase'
import { apiClient } from '@/lib/api-client'
import type { Property, PaginatedResponse } from '@/types'
import type { PortalReadinessCheck, PortalEnhancementMetadata } from '@/types/portal'
import { validatePropertyForPortalPublish } from '@/utils/validation'

interface PropertyFilters {
  page?: number
  pageSize?: number
  type?: string
  city?: string
  status?: string
  isPortalEnhanced?: boolean
  furbishingType?: string
  complianceType?: string
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
      if (filters?.isPortalEnhanced !== undefined) query = query.eq('is_portal_enhanced', filters.isPortalEnhanced)
      if (filters?.furbishingType) query = query.eq('furnishing_type', filters.furbishingType)
      if (filters?.complianceType) query = query.eq('compliance_type', filters.complianceType)

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
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)

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

  // ============================================================================
  // PORTAL-SPECIFIC METHODS
  // ============================================================================

  /**
   * Get properties that need portal enhancement
   */
  async getPropertiesNeedingPortalEnhancement(filters?: PropertyFilters): Promise<PaginatedResponse<Property>> {
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('is_portal_enhanced', false)
        .not('published_portals', 'is', null)

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
      console.error('Error fetching properties needing enhancement:', error)
      throw error
    }
  },

  /**
   * Enhance a property for portal publishing
   */
  async enhancePropertyForPortals(
    propertyId: string,
    enhancementData: {
      furnishingType?: string
      complianceType?: string
      projectStatus?: string
      amenities?: string[]
      portalConfigs?: Array<{
        portal: string
        locationId: string
        locationFullName: string
      }>
    },
    userId: string
  ): Promise<Property> {
    try {
      const updates: Record<string, any> = {
        is_portal_enhanced: true,
        portal_enhancement_completed_at: new Date().toISOString(),
        portal_enhancement_completed_by: userId,
      }

      if (enhancementData.furnishingType) updates.furnishing_type = enhancementData.furnishingType
      if (enhancementData.complianceType) updates.compliance_type = enhancementData.complianceType
      if (enhancementData.projectStatus) updates.project_status = enhancementData.projectStatus
      if (enhancementData.amenities) updates.amenities = enhancementData.amenities

      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId)
        .select()
        .single()

      if (error) throw error

      // Update portal configs if provided
      if (enhancementData.portalConfigs && enhancementData.portalConfigs.length > 0) {
        for (const config of enhancementData.portalConfigs) {
          await supabase.from('property_portal_configs').upsert(
            {
              property_id: propertyId,
              portal: config.portal,
              location_id: config.locationId,
              location_full_name: config.locationFullName,
              is_active: true,
            },
            { onConflict: 'property_id,portal' }
          )
        }
      }

      return data
    } catch (error) {
      console.error(`Error enhancing property ${propertyId}:`, error)
      throw error
    }
  },

  /**
   * Bulk enhance multiple properties for portal publishing
   */
  async bulkEnhancePropertiesForPortals(
    propertyIds: string[],
    enhancementData: {
      furnishingType?: string
      complianceType?: string
      amenities?: string[]
    },
    userId: string
  ): Promise<Property[]> {
    try {
      const updates: Record<string, any> = {
        is_portal_enhanced: true,
        portal_enhancement_completed_at: new Date().toISOString(),
        portal_enhancement_completed_by: userId,
      }

      if (enhancementData.furnishingType) updates.furnishing_type = enhancementData.furnishingType
      if (enhancementData.complianceType) updates.compliance_type = enhancementData.complianceType
      if (enhancementData.amenities) updates.amenities = enhancementData.amenities

      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .in('id', propertyIds)
        .select()

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error bulk enhancing properties:', error)
      throw error
    }
  },

  /**
   * Validate if property is ready to publish to a specific portal
   */
  async validatePropertyReadiness(propertyId: string, portalName: string): Promise<PortalReadinessCheck> {
    try {
      const property = await this.getProperty(propertyId)
      const validationErrors = validatePropertyForPortalPublish(property, portalName)

      return {
        isReadyForPortal: validationErrors.length === 0,
        portal: portalName as any,
        missingFields: validationErrors.map((e) => e.field),
        validationErrors,
        canPublish: validationErrors.length === 0,
      }
    } catch (error) {
      console.error(`Error validating property ${propertyId} for portal:`, error)
      throw error
    }
  },

  /**
   * Publish property to selected portals
   */
  async publishToPortals(propertyId: string, selectedPortals: string[]): Promise<Property> {
    try {
      // Validate property for each portal
      for (const portal of selectedPortals) {
        const readiness = await this.validatePropertyReadiness(propertyId, portal)
        if (!readiness.canPublish) {
          throw new Error(`Property not ready for ${portal}: ${readiness.missingFields.join(', ')}`)
        }
      }

      // Update property with published portals
      const { data, error } = await supabase
        .from('properties')
        .update({
          published_portals: selectedPortals,
        })
        .eq('id', propertyId)
        .select()
        .single()

      if (error) throw error

      // Mark portal configs as published
      for (const portal of selectedPortals) {
        await supabase.from('property_portal_configs').upsert(
          {
            property_id: propertyId,
            portal: portal,
            portal_status: 'published',
            published_at: new Date().toISOString(),
          },
          { onConflict: 'property_id,portal' }
        )
      }

      return data
    } catch (error) {
      console.error(`Error publishing property ${propertyId}:`, error)
      throw error
    }
  },

  /**
   * Sync portal status with portal APIs
   */
  async syncPortalStatus(propertyId: string): Promise<Property> {
    try {
      const response = await apiClient.post<Property>(`/properties/${propertyId}/sync-portals`)
      return response.data
    } catch (error) {
      console.error(`Error syncing portal status for property ${propertyId}:`, error)
      throw error
    }
  },

  /**
   * Search and validate portal locations (PropertyFinder)
   */
  async searchPropertyFinderLocations(query: string): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await apiClient.get<Array<{ id: string; name: string }>>(`/portal-locations/property-finder?q=${query}`)
      return response.data || []
    } catch (error) {
      console.error('Error searching PropertyFinder locations:', error)
      throw error
    }
  },

  /**
   * Search and validate portal locations (Bayut/dubizzle CSV)
   */
  async searchCSVLocations(query: string): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await apiClient.get<Array<{ id: string; name: string }>>(`/portal-locations/csv?q=${query}`)
      return response.data || []
    } catch (error) {
      console.error('Error searching CSV locations:', error)
      throw error
    }
  },
}
