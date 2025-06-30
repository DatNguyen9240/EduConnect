'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';
import { useStudents } from '@/hooks/Student/use-students';
import { useStudentList } from '@/hooks/Student/use-student-list';
import type { Student, StudentFormData } from '@/types/student';
import { SearchBar } from '@/components/ui/CrudStudent/search-bar';
import { StudentStats } from '@/components/ui/CrudStudent/student-stats';
import { StudentTable } from '@/components/ui/CrudStudent/student-table';
import { StudentDialog } from '@/components/ui/CrudStudent/student-dialog';

// Import SimpleCard components
import {
  SimpleCard,
  SimpleCardContent,
  SimpleCardDescription,
  SimpleCardHeader,
  SimpleCardTitle,
} from '@/components/ui/CrudStudent/simple-card';
import { StatsCards } from '@/components/ui/CrudStudent/stats-cards';

export default function StudentManagement() {
  const { addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const {
    data: studentResponse,
    isLoading,
    error,
    isError,
  } = useStudentList({
    pageIndex: currentPage,
    pageSize,
    sortBy: 'FullName',
    ascending: true,
  });

  // Add response type check
  if (!studentResponse) {
    console.error('No student response received');
    return <div>Loading...</div>;
  }

  // Extract data with type safety
  const students = Array.isArray(studentResponse) ? studentResponse : studentResponse.data || [];
  const totalCount =
    typeof studentResponse === 'object' && 'totalCount' in studentResponse
      ? studentResponse.totalCount
      : students.length;
  const totalPages =
    typeof studentResponse === 'object' && 'totalPages' in studentResponse
      ? studentResponse.totalPages
      : Math.ceil(students.length / pageSize);

  console.log('Processed data:', {
    responseType: typeof studentResponse,
    isArray: Array.isArray(studentResponse),
    students,
    totalCount,
    totalPages,
  });

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered data:', {
    searchTerm,
    originalCount: students.length,
    filteredCount: filteredStudents.length,
    firstStudent: filteredStudents[0],
  });

  // Add error type check
  const errorMessage = error instanceof Error ? error.message : 'Đã có lỗi xảy ra';

  // Add detailed error logging
  if (isError) {
    console.error('Error fetching students:', error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // Add response logging
  console.log('Raw student response:', studentResponse);
  console.log('Response structure:', {
    totalCount: studentResponse?.totalCount,
    pageIndex: studentResponse?.pageIndex,
    pageSize: studentResponse?.pageSize,
    totalPages: studentResponse?.totalPages,
    success: studentResponse?.success,
    message: studentResponse?.message,
    error: studentResponse?.error,
    dataLength: studentResponse?.data?.length,
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setViewingStudent(null);
    setIsDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setViewingStudent(null);
    setIsDialogOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const handleSubmitStudent = (formData: StudentFormData) => {
    if (editingStudent) {
      updateStudent(editingStudent.studentID, formData);
    } else {
      addStudent(formData);
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error details:', error);
    return <div>Error loading students: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý học sinh</h1>
          <p className="text-gray-500">Quản lý thông tin học sinh trong trường</p>
        </div>
        <StudentStats totalStudents={totalCount} />
      </div>

      <StatsCards students={students} />

      {/* Debug info */}
      <div className="text-sm text-gray-500 mb-4">Tổng số học sinh: {students.length}</div>

      <SimpleCard>
        <SimpleCardHeader>
          <SimpleCardTitle>Danh sách học sinh</SimpleCardTitle>
          <SimpleCardDescription>Xem và quản lý thông tin tất cả học sinh</SimpleCardDescription>
        </SimpleCardHeader>
        <SimpleCardContent>
          <div className="flex items-center justify-between mb-6">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <Button onClick={handleAddStudent}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm học sinh
            </Button>
          </div>

          {/* Debug info */}
          <div className="text-sm text-gray-500 mb-4">
            Số học sinh đã lọc: {filteredStudents.length}
          </div>

          {/* Explicit error handling */}
          {isError ? (
            <div className="text-red-500">Lỗi: {errorMessage}</div>
          ) : isLoading ? (
            <div className="text-blue-500">Đang tải...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-gray-500">Không có học sinh nào</div>
          ) : (
            <StudentTable
              students={filteredStudents}
              onView={handleViewStudent}
              onEdit={handleEditStudent}
              onDelete={deleteStudent}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </SimpleCardContent>
      </SimpleCard>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={viewingStudent || editingStudent}
        onSubmit={handleSubmitStudent}
      />
    </div>
  );
}
