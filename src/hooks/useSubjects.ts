import { useQuery } from '@tanstack/react-query';
import { getAllSubjects, type Subject } from '@/api/subject.api';

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await getAllSubjects();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export type { Subject };
