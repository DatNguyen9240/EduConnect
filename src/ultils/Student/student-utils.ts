import type { Student } from '@/types/student';

export const generateStudentId = (students: Student[]): string => {
  const maxId = students.reduce((max, student) => {
    const numericId = Number.parseInt(student.studentId.replace('HS', ''));
    return numericId > max ? numericId : max;
  }, 0);

  return `HS${String(maxId + 1).padStart(3, '0')}`;
};

export const generateParentId = (parents: { id: string }[]): string => {
  const maxId = parents.reduce((max, parent) => {
    const numericId = Number.parseInt(parent.id.replace('PH', ''));
    return numericId > max ? numericId : max;
  }, 0);

  return `PH${String(maxId + 1).padStart(3, '0')}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const getStudentsByClass = (students: Student[], classId: string): Student[] => {
  return students.filter((student) => student.classId === classId);
};

export const getStudentsByGrade = (
  students: Student[],
  grade: number,
  classes: { id: string; grade: number }[]
): Student[] => {
  const classesInGrade = classes.filter((cls) => cls.grade === grade).map((cls) => cls.id);
  return students.filter((student) => classesInGrade.includes(student.classId));
};

export const getStudentStats = (students: Student[], classes: { id: string; grade: number }[]) => {
  const stats = {
    total: students.length,
    byGrade: {
      10: getStudentsByGrade(students, 10, classes).length,
      11: getStudentsByGrade(students, 11, classes).length,
      12: getStudentsByGrade(students, 12, classes).length,
    },
    byGender: {
      male: students.filter((s) => s.gender === 'Nam').length,
      female: students.filter((s) => s.gender === 'Nữ').length,
    },
  };

  return stats;
};
