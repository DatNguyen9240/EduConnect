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
  totalPages?: number;
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
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
  const { hasRole, isAdmin, userInfo } = useContext(AppContext);
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');
  const isTeacher = hasRole('Teacher') || hasRole('teacher');
  const isParent = hasRole('Parent') || hasRole('parent');

  return useQuery<FeedbackListResponse>({
    queryKey: ['feedbacks', params, isPrincipal, isTeacher, isParent, userInfo?.id],
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {};
      if (params?.pageIndex !== undefined) queryParams.pageIndex = params.pageIndex;
      if (params?.pageSize !== undefined) queryParams.pageSize = params.pageSize;
      if (params?.sortBy !== undefined) queryParams.sortBy = params.sortBy;
      if (params?.ascending !== undefined) queryParams.ascending = params.ascending;
      if (params?.searchTerm !== undefined) queryParams.searchTerm = params.searchTerm;
      if (params?.targetFilter !== undefined) queryParams.targetFilter = params.targetFilter;
      // Nếu là parent thì truyền parentId và không truyền target
      if (isParent && userInfo?.id) {
        queryParams.parentId = userInfo.id;
        // Không set target để lấy all feedbacks của parent
      } else if (isTeacher) {
        queryParams.target = 'teacher';
        if (params?.parentId !== undefined) queryParams.parentId = params.parentId;
      } else if (isPrincipal) {
        // Principal lấy tất cả, không truyền target
        if (params?.parentId !== undefined) queryParams.parentId = params.parentId;
      } else if (params?.target !== undefined) {
        queryParams.target = params.target;
        if (params?.parentId !== undefined) queryParams.parentId = params.parentId;
      }
      // Default values nếu không có params
      if (queryParams.pageIndex === undefined) queryParams.pageIndex = 0;
      if (queryParams.pageSize === undefined) queryParams.pageSize = 10;
      if (queryParams.sortBy === undefined) queryParams.sortBy = 'DateTime';
      if (queryParams.ascending === undefined) queryParams.ascending = false;
      return await api.get<FeedbackListResponse>('/api/v1/feedbacks', queryParams);
    },
    enabled: isPrincipal || isTeacher || isParent,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
