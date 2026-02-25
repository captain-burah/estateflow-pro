/**
 * Custom hook for making API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import { apiClient, ApiResponse, ApiError } from '@/lib/api-client';

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export const useApi = <T,>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
      body?: unknown
    ) => {
      setState({ data: null, loading: true, error: null });

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case 'POST':
            response = await apiClient.post<T>(endpoint, body);
            break;
          case 'PUT':
            response = await apiClient.put<T>(endpoint, body);
            break;
          case 'PATCH':
            response = await apiClient.patch<T>(endpoint, body);
            break;
          case 'DELETE':
            response = await apiClient.delete<T>(endpoint);
            break;
          default:
            response = await apiClient.get<T>(endpoint);
        }

        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        options.onSuccess?.(response.data);
        return response.data;
      } catch (error) {
        const apiError = error as ApiError;
        setState({
          data: null,
          loading: false,
          error: apiError,
        });

        options.onError?.(apiError);
        throw apiError;
      }
    },
    [options]
  );

  return { ...state, execute };
};
