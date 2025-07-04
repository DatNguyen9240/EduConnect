'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';
import { useStudents } from '@/hooks/Student/use-students';
import { useStudentList } from '@/hooks/Student/use-student-list';
import type { Student } from '@/types/student';
import { SearchBar } from '@/components/ui/CrudStudent/search-bar';
import { StudentStats } from '@/components/ui/CrudStudent/student-stats';
import { StudentTable } from '@/components/ui/CrudStudent/student-table';
import { StudentDialog } from '@/components/ui/CrudStudent/student-dialog';
import { AddStudentDialog } from '@/components/ui/CrudStudent/add-student-dialog';

// Import SimpleCard components
import {
  SimpleCard,
  SimpleCardContent,
  SimpleCardDescription,
  SimpleCardHeader,
  SimpleCardTitle,
} from '@/components/ui/CrudStudent/simple-card';
import { StatsCards } from '@/components/ui/CrudStudent/stats-cards';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/common/Select';
import { useClassList } from '@/hooks/useClassList';
import { useClassStudents } from '@/hooks/useClassStudents';
import { useUnassignedStudents } from '@/hooks/useUnassignedStudents';

export default function StudentManagement() {
  const { deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { data: classListData } = useClassList();
  const classOptions = classListData?.data?.items || [];
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const {
    data: unassignedData,
    isLoading: isUnassignedLoading,
    error: unassignedError,
    refetch: refetchUnassigned,
  } = useUnassignedStudents();

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

  const {
    data: classStudentResponse,
    isLoading: isClassStudentLoading,
    error: classStudentError,
    // isError: isClassStudentError,
    refetch: refetchClassStudents,
  } = useClassStudents(selectedClass, selectedClass !== 'all');

  // Extract data with type safety
  const students =
    selectedClass === 'all'
      ? Array.isArray(studentResponse)
        ? studentResponse
        : studentResponse?.data || []
      : classStudentResponse?.data || [];
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
      (selectedClass === 'all' || String(student.classID) === selectedClass) &&
      (student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName?.toLowerCase().includes(searchTerm.toLowerCase()))
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
    setIsAddDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setViewingStudent(null);
    setIsDialogOpen(true);
  };

  const handleShowUnassigned = () => {
    setShowUnassigned(true);
    if (refetchUnassigned) refetchUnassigned();
  };

  if (selectedClass !== 'all' && isClassStudentLoading) {
    return <div>Loading students for class...</div>;
  }
  if (selectedClass !== 'all' && classStudentError) {
    return <div>Error loading students for class: {classStudentError.message}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý học sinh</h1>
          <p className="text-gray-500">Quản lý thông tin học sinh trong trường</p>
        </div>
        <div className="flex gap-2 items-center">
          <StudentStats totalStudents={totalCount} />
          {showUnassigned ? (
            <Button variant="outline" onClick={() => setShowUnassigned(false)}>
              Quay lại
            </Button>
          ) : (
            <Button variant="outline" onClick={handleShowUnassigned}>
              Xem học sinh chưa có lớp
            </Button>
          )}
        </div>
      </div>

      <StatsCards students={students as Student[]} />

      <SimpleCard>
        <SimpleCardHeader>
          <SimpleCardTitle>Danh sách học sinh</SimpleCardTitle>
          <SimpleCardDescription>Xem và quản lý thông tin tất cả học sinh</SimpleCardDescription>
        </SimpleCardHeader>
        <SimpleCardContent>
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex gap-4 items-center">
              <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              {!showUnassigned && (
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả lớp</SelectItem>
                    {classOptions.map((cls) => (
                      <SelectItem key={cls.classID} value={cls.classID.toString()}>
                        {cls.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleAddStudent}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm học sinh
              </Button>
            </div>
          </div>

          {showUnassigned ? (
            isUnassignedLoading ? (
              <div>Đang tải học sinh chưa có lớp...</div>
            ) : unassignedError ? (
              <div className="text-red-500">Lỗi: {unassignedError.message}</div>
            ) : (
              <StudentTable
                students={unassignedData?.data as unknown as Student[]}
                onEdit={handleEditStudent}
                onDelete={deleteStudent}
                currentPage={0}
                totalPages={1}
                onPageChange={() => {}}
              />
            )
          ) : isError ? (
            <div className="text-red-500">Lỗi: {errorMessage}</div>
          ) : isLoading ? (
            <div className="text-blue-500">Đang tải...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-gray-500">Không có học sinh nào</div>
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={deleteStudent}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              classID={selectedClass !== 'all' ? selectedClass : undefined}
              refetchClassStudents={selectedClass !== 'all' ? refetchClassStudents : undefined}
            />
          )}
        </SimpleCardContent>
      </SimpleCard>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={viewingStudent || editingStudent}
      />

      <AddStudentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          if (showUnassigned && refetchUnassigned) refetchUnassigned();
          if (selectedClass !== 'all' && !showUnassigned && refetchClassStudents)
            refetchClassStudents();
        }}
      />
    </div>
  );
}
