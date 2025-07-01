export interface Student {
  id: string;
  studentId: string; // StudentID từ database
  fullName: string; // FullName
  dateOfBirth: string; // DateOfBirth
  gender: string; // Gender
  classId: string; // ClassID
  className: string; // Tên lớp để hiển thị
  parentId: string; // ParentID
  parentName: string; // Tên phụ huynh
  parentPhone: string; // SĐT phụ huynh
  address: string; // Địa chỉ
  email: string; // Email học sinh
}

export type StudentFormData = Omit<Student, 'id'>;

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
