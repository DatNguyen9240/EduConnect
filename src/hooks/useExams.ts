import { useQuery } from '@tanstack/react-query';
import { useMemo, useContext } from 'react';
import { examApi, type GetExamParams, type ExamListResponse } from '@/api/exam.api';
import { AppContext } from '@/contexts/app.context';
import { useSelectedStudent } from '@/contexts/selected-student.context';

export function useExams(params?: Partial<GetExamParams>) {
  const { hasRole, isAdmin, userInfo } = useContext(AppContext);
  const { selectedStudent } = useSelectedStudent();

  // Nếu là parent và đã chọn con, truyền studentId của con vào API
  const currentStudentId =
    (userInfo?.roles.includes('Parent') && selectedStudent?.studentId) ||
    params?.studentId ||
    undefined;

  // Kiểm tra role để quyết định API endpoint
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
      studentId: currentStudentId,
      searchTerm: params?.searchTerm,
      sortBy: params?.sortBy || 'examDate',
      ascending: params?.ascending ?? true,
      pageIndex: params?.pageIndex ?? 1,
      pageSize: params?.pageSize ?? 10,
    }),
    [
      params?.startDate,
      params?.endDate,
      currentStudentId,
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
      return examApi.getExamsByStudent(currentStudentId || '', defaultParams);
    }
  };

  return useQuery<ExamListResponse>({
    queryKey: ['exams', isPrincipal ? 'all' : currentStudentId || '', defaultParams],
    queryFn,
    enabled: !!currentStudentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
