import { useQuery } from '@tanstack/react-query';
import { getClassList } from '@/api/class.api';
import type { ClassListResponse } from '@/api/class.api';

export function useClassList(
  params = { pageIndex: 0, pageSize: 100, sortBy: 'ClassName', ascending: true }
) {
  return useQuery<ClassListResponse>({
    queryKey: ['class-list', params],
    queryFn: () => getClassList(params),
  });
}
