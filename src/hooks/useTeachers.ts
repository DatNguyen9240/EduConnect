import { useQuery } from '@tanstack/react-query';
import { getTeachers } from '@/api/teacher.api';
import type { TeacherListResponse } from '@/types/teacher';

export function useTeachers(params: {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  ascending?: boolean;
}) {
  return useQuery<TeacherListResponse>({
    queryKey: ['teachers', params],
    queryFn: () => getTeachers(params),
    staleTime: 1000 * 60 * 5,
  });
}
