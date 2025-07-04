import { useQuery } from '@tanstack/react-query';
import { gradeApi } from '@/api/grade.api';

// Định nghĩa lại type Grade ở đây nếu chưa có import
export interface Grade {
  gradeID: number;
  studentID: string;
  studentName: string;
  subjectID: number;
  subjectName: string;
  classID: number;
  className: string;
  score: number;
  gradeType: string;
  gradeLevel: number;
  semester: string;
  evaluation: string;
  createdDate: string | null;
  updatedDate: string | null;
}

export function useGrades(studentId: string, enabled = true) {
  return useQuery<{ data: Grade[] }>({
    queryKey: ['grades', studentId],
    queryFn: () => gradeApi.getGradesByStudent(studentId),
    enabled: !!studentId && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
