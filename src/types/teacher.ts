export interface Teacher {
  teacherId: string;
  accountId: string;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  classes: unknown[];
}

export interface TeacherListResponse {
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  success: boolean;
  message: string;
  data: Teacher[];
  error: string[] | null;
}
