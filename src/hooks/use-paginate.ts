/**
 * Custom hook for pagination
 */

import { useState, useCallback } from 'react';

interface UsePaginateOptions {
  initialPage?: number;
  pageSize?: number;
}

export const usePaginate = (options: UsePaginateOptions = {}) => {
  const { initialPage = 1, pageSize = 10 } = options;
  const [page, setPage] = useState(initialPage);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    reset,
    offset: (page - 1) * pageSize,
  };
};
