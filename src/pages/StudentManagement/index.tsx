'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Plus } from 'lucide-react';
import { useStudents } from '@/hooks/Student/use-students';
import { SearchBar } from '@/components/ui/CrudStudent/search-bar';
import { StudentStats } from '@/components/ui/CrudStudent/student-stats';
import { StudentTable } from '@/components/ui/CrudStudent/student-table';
import { StudentDialog } from '@/components/ui/CrudStudent/student-dialog';
import type { Student, StudentFormData } from '@/types/student';

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
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    setEditingStudent(null);
    setIsDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsDialogOpen(true);
  };

  const handleSubmitStudent = (formData: StudentFormData) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent(formData);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý học sinh</h1>
          <p className="text-gray-500">Quản lý thông tin học sinh trong trường</p>
        </div>
        <StudentStats totalStudents={students.length} />
      </div>

      <StatsCards students={students} />

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

          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={deleteStudent}
          />
        </SimpleCardContent>
      </SimpleCard>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={editingStudent}
        onSubmit={handleSubmitStudent}
      />
    </div>
  );
}
