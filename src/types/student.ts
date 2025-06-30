export interface Student {
  studentID: string;
  accountID: string;
  parentID: string;
  classID: number | null;
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
  studentID: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  classID: string;
  className: string;
  parentID: string;
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
