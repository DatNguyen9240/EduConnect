import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import type { AxiosResponse } from 'axios';
import type { Student } from '@/types/student';

export interface StudentResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  message: string;
  data: Student[];
  error: string | null;
}

interface UseStudentListParams {
  pageIndex?: number;
  pageSize?: number;
  sortBy?: string;
  ascending?: boolean;
}

const fetchStudents = async ({
  pageIndex = 0,
  pageSize = 10,
  sortBy = 'FullName',
  ascending = true,
}: UseStudentListParams): Promise<StudentResponse> => {
  const response: AxiosResponse<StudentResponse> = await axios.get(
    `/api/v1/students?pageIndex=${pageIndex}&pageSize=${pageSize}&sortBy=${sortBy}&ascending=${ascending}`
  );
  return response.data;
};

export const useStudentList = (params: UseStudentListParams = {}) => {
  return useQuery<StudentResponse, Error>({
    queryKey: ['students', params],
    queryFn: () => fetchStudents(params),
  });
};
