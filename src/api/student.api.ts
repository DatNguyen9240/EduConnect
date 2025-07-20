import api from '@/lib/axios';

export interface Student {
  studentId: string;
  fullName: string;
  classID?: string;
  className?: string;
  parentName?: string;
  isActive: boolean;
}

export interface StudentsResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  message: string;
  data: Student[];
  error: string | null;
}

export const getAllStudents = async (params?: {
  pageIndex?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  ascending?: boolean;
}): Promise<StudentsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.pageIndex !== undefined) queryParams.append('pageIndex', params.pageIndex.toString());
  if (params?.pageSize !== undefined) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.ascending !== undefined) queryParams.append('ascending', params.ascending.toString());

  const url = `/api/v1/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return api.get<StudentsResponse>(url);
};
