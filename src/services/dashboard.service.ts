/**
 * Dashboard Service
 * Handles dashboard statistics and analytics API calls
 */

import { apiClient } from '@/lib/api-client';
import type { DashboardStats } from '@/types';

export const dashboardService = {
  /**
   * Fetch dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },

  /**
   * Fetch revenue data for charts
   */
  async getRevenueData(period: 'week' | 'month' | 'year' = 'month'): Promise<any[]> {
    const response = await apiClient.get(`/dashboard/revenue?period=${period}`);
    return response.data;
  },

  /**
   * Fetch agent performance data
   */
  async getAgentPerformanceData(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/agent-performance');
    return response.data;
  },

  /**
   * Fetch portal statistics
   */
  async getPortalStats(): Promise<any[]> {
    const response = await apiClient.get('/dashboard/portal-stats');
    return response.data;
  },
};
