'use client';

import { useState } from 'react';
import type { Student, StudentFormData } from '@/types/student';
import { toast } from '@/hooks/Toast/use-toast';

import { SUCCESS_MESSAGES } from '@/constants/student';

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = (formData: StudentFormData) => {
    const studentId = Date.now().toString();
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const newStudent: Student = {
      ...formData,
      classID: formData.classID ? String(formData.classID) : '',
      studentId: studentId,
      accountID: `ACC_${studentId}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      firstName,
      lastName,
      avatarUrl: '', // hoặc avatar mặc định nếu muốn
    };
    setStudents((prev) => [...prev, newStudent]);
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.ADD_STUDENT,
    });
  };

  const updateStudent = (studentId: string, formData: StudentFormData) => {
    // Tách họ và tên
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    setStudents((prev) =>
      prev.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              ...formData,
              classID: formData.classID ? String(formData.classID) : '',
              updatedAt: new Date().toISOString(),
              firstName,
              lastName,
            }
          : student
      )
    );
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.UPDATE_STUDENT,
    });
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((student) => student.studentId !== studentId));
    toast({
      title: 'Thành công',
      description: SUCCESS_MESSAGES.DELETE_STUDENT,
    });
  };

  return {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}
