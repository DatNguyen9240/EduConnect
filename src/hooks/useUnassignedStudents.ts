import { useQuery } from '@tanstack/react-query';
import { getUnassignedStudents } from '@/api/class.api';

export function useUnassignedStudents() {
  return useQuery({
    queryKey: ['unassigned-students'],
    queryFn: getUnassignedStudents,
  });
}
