import { useQuery } from '@tanstack/react-query';
import type { Student } from '@/types/student';
import axios from '@/lib/axios';
import type { AxiosResponse } from 'axios';

export const useStudentDetail = (studentId: string | undefined) => {
  return useQuery<Student, Error>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      try {
        const response: AxiosResponse = await axios.get(`/api/v1/students/${studentId}`);
        const data = response.data;

        // Nếu response là object student (có studentID) thì trả về
        if (data && data.studentId) {
          return data as Student;
        }

        // Nếu response là dạng cũ (bọc trong data) thì trả về data
        if (data && data.data && data.data.studentId) {
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
