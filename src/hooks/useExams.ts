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
    (userInfo?.role === 'Parent' && selectedStudent?.studentId) ||
    (userInfo?.role === 'Student' && userInfo?.id) ||
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
  const queryFn = async () => {
    try {
      if (isPrincipal) {
        return await examApi.getAllExams(defaultParams);
      } else {
        return await examApi.getExamsByStudent(currentStudentId || '', defaultParams);
      }
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 404
      ) {
        // Trả về dữ liệu rỗng nếu không có lịch thi
        return {
          data: [],
          totalCount: 0,
          pageIndex: defaultParams.pageIndex,
          pageSize: defaultParams.pageSize,
          totalPages: 1,
          success: true,
          message: 'No exams found',
          error: null,
        };
      }
      throw error;
    }
  };

  return useQuery<ExamListResponse>({
    queryKey: ['exams', isPrincipal ? 'all' : currentStudentId || '', defaultParams],
    queryFn,
    enabled: isPrincipal || !!currentStudentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
