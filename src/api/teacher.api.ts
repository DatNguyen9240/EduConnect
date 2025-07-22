import api from '@/lib/axios';
import type { TeacherListResponse } from '@/types/teacher';

export const getTeachers = (params: {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  ascending?: boolean;
}) => {
  return api.get<TeacherListResponse>('/api/v1/teachers', params);
};
