/**
 * Agent Service
 * Handles all agent-related database operations via Supabase
 */

import { supabase } from '@/lib/supabase'
import type { Agent } from '@/types'

export const agentService = {
  /**
   * Fetch all agents
   */
  async getAgents(): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching agents:', error)
      throw error
    }
  },

  /**
   * Fetch a single agent by ID
   */
  async getAgent(id: string): Promise<Agent> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching agent ${id}:`, error)
      throw error
    }
  },

  /**
   * Create a new agent
   */
  async createAgent(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    try {
      const { data: agent, error } = await supabase
        .from('agents')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return agent
    } catch (error) {
      console.error('Error creating agent:', error)
      throw error
    }
  },

  /**
   * Update an agent
   */
  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error updating agent ${id}:`, error)
      throw error
    }
  },

  /**
   * Delete an agent
   */
  async deleteAgent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error(`Error deleting agent ${id}:`, error)
      throw error
    }
  },

  /**
   * Get agent performance metrics
   */
  async getAgentPerformance(id: string): Promise<{
    agent: Agent
    totalListings: number
    totalSales: number
    totalRevenue: number
    averageRating: number
  }> {
    try {
      const agent = await this.getAgent(id)

      const [listingsResult, transactionsResult] = await Promise.all([
        supabase
          .from('listings')
          .select('*', { count: 'exact' })
          .eq('agent_id', id),
        supabase
          .from('transactions')
          .select('sale_price, commission_amount')
          .eq('agent_id', id)
          .eq('status', 'completed'),
      ])

      const totalListings = listingsResult.count || 0
      const totalSales = transactionsResult.data?.length || 0
      const totalRevenue = transactionsResult.data?.reduce(
        (sum, t) => sum + (t.commission_amount || 0),
        0
      ) || 0

      return {
        agent,
        totalListings,
        totalSales,
        totalRevenue,
        averageRating: agent.rating || 5.0,
      }
    } catch (error) {
      console.error(`Error fetching agent performance ${id}:`, error)
      throw error
    }
  },

  /**
   * Get properties listed by an agent
   */
  async getAgentListings(agentId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          properties (*)
        `)
        .eq('agent_id', agentId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error fetching agent listings ${agentId}:`, error)
      throw error
    }
  },

  /**
   * Get agents by company
   */
  async getAgentsByCompany(companyId: string): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error fetching agents for company ${companyId}:`, error)
      throw error
    }
  },

  /**
   * Get top performing agents
   */
  async getTopAgents(limit = 10): Promise<Agent[]> {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('total_sales', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching top agents:', error)
      throw error
    }
  },

  /**
   * Subscribe to agent updates
   */
  subscribeToAgents(callback: (agent: Agent) => void) {
    const subscription = supabase
      .from('agents')
      .on('*', (payload) => {
        callback(payload.new as Agent)
      })
      .subscribe()

    return subscription
  },
}
