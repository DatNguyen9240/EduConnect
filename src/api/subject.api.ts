import api from '@/lib/axios';

export interface Subject {
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  description: string;
  isDeleted: boolean;
  lessonCount: number;
  examCount: number;
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  data: Subject[];
  error: string | null;
}

export const getAllSubjects = async (): Promise<SubjectsResponse> => {
  return api.get<SubjectsResponse>('/api/v1/subjects/all');
};
