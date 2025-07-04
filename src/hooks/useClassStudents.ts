import { useQuery } from '@tanstack/react-query';
import { getStudentsByClassID } from '@/api/class.api';

export function useClassStudents(classID: number | string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['class-students', classID],
    queryFn: () => getStudentsByClassID(classID),
    enabled: enabled && !!classID && classID !== 'all',
  });
}
