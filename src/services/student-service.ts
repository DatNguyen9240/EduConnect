import type { Student, StudentFormData } from '@/types/student';
import { mockStudents } from '@/data/Student/students';
import { generateStudentId, generateParentId } from '@/ultils/Student/student-utils';

// Mô phỏng API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class StudentService {
  private static students: Student[] = [...mockStudents];

  static async getAllStudents(): Promise<Student[]> {
    await delay(500); // Mô phỏng network delay
    return [...this.students];
  }

  static async getStudentById(id: string): Promise<Student | null> {
    await delay(300);
    return this.students.find((student) => student.id === id) || null;
  }

  static async createStudent(formData: StudentFormData): Promise<Student> {
    await delay(800);

    const newStudent: Student = {
      ...formData,
      id: Date.now().toString(),
      studentId: formData.studentId || generateStudentId(this.students),
      parentId: formData.parentId || generateParentId(),
    };

    this.students.push(newStudent);
    return newStudent;
  }

  static async updateStudent(id: string, formData: StudentFormData): Promise<Student> {
    await delay(600);

    const index = this.students.findIndex((student) => student.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }

    const updatedStudent: Student = {
      ...formData,
      id,
    };

    this.students[index] = updatedStudent;
    return updatedStudent;
  }

  static async deleteStudent(id: string): Promise<void> {
    await delay(400);

    const index = this.students.findIndex((student) => student.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }

    this.students.splice(index, 1);
  }

  static async searchStudents(query: string): Promise<Student[]> {
    await delay(300);

    const lowercaseQuery = query.toLowerCase();
    return this.students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(lowercaseQuery) ||
        student.studentId.toLowerCase().includes(lowercaseQuery) ||
        student.className.toLowerCase().includes(lowercaseQuery) ||
        student.parentName.toLowerCase().includes(lowercaseQuery)
    );
  }
}
