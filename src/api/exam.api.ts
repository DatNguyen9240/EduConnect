import api from '@/lib/axios';
import type { Exam } from '@/types/exam';

export interface ExamListResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  data: Exam[];
  success: boolean;
  message: string;
  error: null | string;
}

export interface GetExamParams {
  startDate?: string;
  endDate?: string;
  studentId?: string;
  searchTerm?: string;
  sortBy?: string;
  ascending: boolean;
  pageIndex: number;
  pageSize: number;
}

// Helper function to filter out undefined values
const filterParams = (params: GetExamParams) => {
  const filtered: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && key !== 'studentId') {
      filtered[key] = value;
    }
  });
  return filtered;
};

export const examApi = {
  // API cho Principal - xem tất cả lịch thi
  getAllExams: (params: GetExamParams) =>
    api.get<ExamListResponse>('/api/Exam/Exams', filterParams(params)),

  // API cho non-Principal - xem lịch thi theo studentId
  getExamsByStudent: (studentId: string, params: GetExamParams) =>
    api.get<ExamListResponse>(`/api/Exam/by-student/${studentId}`, filterParams(params)),
};
