'use client';

import { useState } from 'react';
import type { Student, StudentFormData } from '@/types/student';
import { toast } from '@/hooks/Toast/use-toast';

// Import data từ các file riêng
import { mockStudents } from '@/data/Student/students';
import { mockClasses, getClassName } from '@/data/Student/classes';
import { SUCCESS_MESSAGES } from '@/constants/student';

export function useStudents() {
  // Thay thế initialStudents bằng mockStudents
  const [students, setStudents] = useState<Student[]>(mockStudents);

  // Thay thế classes bằng mockClasses
  const classes = mockClasses;

  const addStudent = (formData: StudentFormData) => {
    const newStudent: Student = {
      ...formData,
      id: Date.now().toString(),
    };
    setStudents((prev) => [...prev, newStudent]);
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.ADD_STUDENT,
    });
  };

  const updateStudent = (id: string, formData: StudentFormData) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...formData, id } : student))
    );
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.UPDATE_STUDENT,
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.DELETE_STUDENT,
    });
  };

  return {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}

// Export thêm getClassName function
export { getClassName };
