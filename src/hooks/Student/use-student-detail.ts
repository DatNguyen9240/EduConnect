import { useQuery } from '@tanstack/react-query';
import type { Student } from '@/types/student';
import axios from '@/lib/axios';

export const useStudentDetail = (studentId: string | undefined) => {
  return useQuery<Student, Error>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      try {
        const response: any = await axios.get(`/api/Student/${studentId}`);
        const data = response.data;
        console.log('Raw API Response:', data);

        // Nếu response là object student (có studentID) thì trả về luôn
        if (data && data.studentID) {
          return data as Student;
        }

        // Nếu response là dạng cũ (bọc trong data) thì trả về data
        if (data && data.data && data.data.studentID) {
          return data.data as Student;
        }

        throw new Error('Invalid student data received from API');
      } catch (error) {
        console.error('Error fetching student details:', error);
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unknown error occurred');
      }
    },
    enabled: !!studentId,
  });
};
