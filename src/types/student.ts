export interface Student {
  studentId: string;
  accountId: string;
  parentId: string;
  classId: string;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  dateOfBirth: string | null;
  gender: string;
  className: string;
  parentName: string;
  address?: string;
  parentPhone?: string;
}

export type StudentFormData = {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  classId: string;
  className: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  address: string;
  email: string;
};

export interface Class {
  id: string;
  name: string;
  grade: number; // Khối (10, 11, 12)
  section: string; // Ban (A, B, C, D)
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  occupation: string; // Nghề nghiệp
}
