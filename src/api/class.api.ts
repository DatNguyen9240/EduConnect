import api from '@/lib/axios';

export interface ClassItem {
  classID: number;
  className: string;
  isDeleted: boolean;
}

export interface ApiError {
  code?: string | number;
  message?: string;
  details?: unknown;
}

export interface ClassListResponse {
  success: boolean;
  message: string;
  data: {
    items: ClassItem[];
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
  };
  error: ApiError | null;
}

export interface Student {
  studentID: number | string;
  studentName: string;
  [key: string]: unknown;
}

export interface StudentsByClassResponse {
  success: boolean;
  message: string;
  data: Student[];
  error: ApiError | null;
}

export interface AddStudentsToClassResponse {
  success: boolean;
  message: string;
  data: { addedCount: number; [key: string]: unknown } | null;
  error: ApiError | null;
}

export interface RemoveStudentFromClassResponse {
  success: boolean;
  message: string;
  data: { removedCount: number; [key: string]: unknown } | null;
  error: ApiError | null;
}

export interface RemoveStudentResponse {
  success: boolean;
  message: string;
  data: { removed: boolean; [key: string]: unknown } | null;
  error: ApiError | null;
}

export interface UnassignedStudentsResponse {
  success: boolean;
  message: string;
  data: Student[];
  error: ApiError | null;
}

export async function getClassList(
  params = { pageIndex: 0, pageSize: 100, sortBy: 'ClassName', ascending: true }
): Promise<ClassListResponse> {
  return await api.get<ClassListResponse>('/api/Class/Classes', params);
}

export async function getStudentsByClassID(
  classID: number | string
): Promise<StudentsByClassResponse> {
  const response = await api.get<StudentsByClassResponse>(
    `/api/ClassManagement/classes/${classID}/students`
  );
  return response;
}

export async function addStudentsToClass(
  classID: number | string,
  studentIDs: string[]
): Promise<AddStudentsToClassResponse> {
  const response = await api.post<AddStudentsToClassResponse>(
    `/api/ClassManagement/classes/${classID}/students`,
    { studentIDs }
  );
  return response;
}

export async function removeStudentFromClass(
  classID: number | string,
  studentIDs: string[]
): Promise<RemoveStudentFromClassResponse> {
  return await api.delete<RemoveStudentFromClassResponse>(
    `/api/ClassManagement/classes/${classID}/students`,
    { data: { studentIDs } }
  );
}

export async function removeStudent(studentID: number | string): Promise<RemoveStudentResponse> {
  return await api.delete<RemoveStudentResponse>(
    `/api/ClassManagement/students/${studentID}/class`
  );
}

export async function getUnassignedStudents(): Promise<UnassignedStudentsResponse> {
  return await api.get<UnassignedStudentsResponse>('/api/ClassManagement/students/unassigned');
}
