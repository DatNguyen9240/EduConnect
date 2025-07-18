import api from '@/lib/axios';
import type { Grade } from '@/hooks/useGrades';

export const gradeApi = {
  getGradesByStudent: (studentId: string): Promise<{ data: Grade[] }> =>
    api.get(`/api/v1/grades/by-student/${studentId}`),
};
