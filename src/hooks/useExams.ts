import { useQuery } from '@tanstack/react-query';
import { useMemo, useContext } from 'react';
import { examApi, type GetExamParams, type ExamListResponse } from '@/api/exam.api';
import { AppContext } from '@/contexts/app.context';

export function useExams(params?: Partial<GetExamParams>) {
  const { hasRole, isAdmin } = useContext(AppContext);

  // TODO: Sử dụng accountId từ token sau khi test xong
  // const currentAccountId = userInfo?.accountId || '52f061e7-3a86-4cf9-9542-499d3c28bf1d';

  // Sử dụng accountId mẫu để test
  const currentAccountId = '52f061e7-3a86-4cf9-9542-499d3c28bf1d';

  // Kiểm tra role để quyết định API endpoint
  // Principal có thể là Admin hoặc có role Principal cụ thể
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');

  // Calculate default parameters: từ đầu năm đến cuối năm hiện tại
  const currentYear = new Date().getFullYear();
  const defaultStartDate = `${currentYear}-01-01`;
  const defaultEndDate = `${currentYear}-12-31`;

  // Memoize defaultParams to prevent unnecessary re-renders
  const defaultParams: GetExamParams = useMemo(
    () => ({
      startDate: params?.startDate || defaultStartDate,
      endDate: params?.endDate || defaultEndDate,
      studentId: params?.studentId,
      searchTerm: params?.searchTerm,
      sortBy: params?.sortBy || 'examDate',
      ascending: params?.ascending ?? true,
      pageIndex: params?.pageIndex ?? 1,
      pageSize: params?.pageSize ?? 10,
    }),
    [
      params?.startDate,
      params?.endDate,
      params?.studentId,
      params?.searchTerm,
      params?.sortBy,
      params?.ascending,
      params?.pageIndex,
      params?.pageSize,
      defaultStartDate,
      defaultEndDate,
    ]
  );

  // Chọn API endpoint dựa trên role
  const queryFn = () => {
    if (isPrincipal) {
      return examApi.getAllExams(defaultParams);
    } else {
      return examApi.getExamsByAccount(currentAccountId, defaultParams);
    }
  };

  return useQuery<ExamListResponse>({
    queryKey: ['exams', isPrincipal ? 'all' : currentAccountId, defaultParams],
    queryFn,
    enabled: !!currentAccountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
