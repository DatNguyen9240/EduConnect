import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import type { Feedback } from '@/types/feedback';

export interface FeedbackListResponse {
  success: boolean;
  message: string;
  data: Feedback[];
  error: null | string[];
}

export interface FeedbackQueryParams {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  ascending?: boolean;
  targetFilter?: string;
  parentId?: string;
  target?: string;
}

export function useFeedbacks(params?: FeedbackQueryParams) {
  const { hasRole, isAdmin } = useContext(AppContext);
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');

  return useQuery<FeedbackListResponse>({
    queryKey: ['feedbacks', params],
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {};
      if (params?.pageIndex !== undefined) queryParams.pageIndex = params.pageIndex;
      if (params?.pageSize !== undefined) queryParams.pageSize = params.pageSize;
      if (params?.sortBy !== undefined) queryParams.sortBy = params.sortBy;
      if (params?.ascending !== undefined) queryParams.ascending = params.ascending;
      if (params?.target !== undefined) queryParams.target = params.target;
      if (params?.searchTerm !== undefined) queryParams.searchTerm = params.searchTerm;
      if (params?.targetFilter !== undefined) queryParams.targetFilter = params.targetFilter;
      if (params?.parentId !== undefined) queryParams.parentId = params.parentId;
      // Default values nếu không có params
      if (queryParams.pageIndex === undefined) queryParams.pageIndex = 0;
      if (queryParams.pageSize === undefined) queryParams.pageSize = 10;
      if (queryParams.sortBy === undefined) queryParams.sortBy = 'DateTime';
      if (queryParams.ascending === undefined) queryParams.ascending = false;
      if (queryParams.target === undefined) queryParams.target = 'principal';
      return await api.get<FeedbackListResponse>('/api/v1/feedbacks', queryParams);
    },
    enabled: isPrincipal,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
