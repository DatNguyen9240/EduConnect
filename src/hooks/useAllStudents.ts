import { useQuery } from '@tanstack/react-query';
import { getAllStudents, type Student } from '@/api/student.api';

export const useAllStudents = (params?: {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  ascending?: boolean;
}) => {
  return useQuery({
    queryKey: ['all-students', params],
    queryFn: () => getAllStudents(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { Student };
