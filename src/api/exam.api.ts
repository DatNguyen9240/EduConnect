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
    api.get<ExamListResponse>('/api/v1/exams', filterParams(params)),

  // API cho non-Principal - xem lịch thi theo studentId
  getExamsByStudent: (studentId: string, params: GetExamParams) =>
    api.get<ExamListResponse>(`/api/v1/exams/by-student/${studentId}`, filterParams(params)),
};

// Định nghĩa type ExamDetail nếu chưa có
export type ExamDetail = {
  examId: number;
  subjectName: string;
  subjectCode: string;
  examType: string;
  examNote: string;
  examDate: string;
  gradeDate: string;
  room: string;
  studentId: string;
  createdBy: string;
  createdDate: string;
};

export const getExamDetail = (examId: number | string) => {
  return api.get<{ data: ExamDetail }>(`/api/v1/exams/${examId}`);
};

export const deleteExam = (examId: number | string) => {
  return api.delete(`/api/v1/exams/${examId}`);
};

export type UpdateExamPayload = {
  subjectId: number;
  examType: string;
  examNote: string;
  examDate: string;
  gradeDate: string;
  room: string;
  studentId: string;
  // Thêm các trường khác nếu cần
};

export const updateExam = (examId: number | string, payload: UpdateExamPayload) => {
  return api.put(`/api/v1/exams/${examId}`, payload);
};
