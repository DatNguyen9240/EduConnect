'use client';

import { Button } from '@/components/common/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Eye, Trash2, Edit } from 'lucide-react';
import type { Student } from '@/types/student';
import { StudentDialog } from './student-dialog';
import { useState } from 'react';
import { removeStudent, removeStudentFromClass } from '@/api/class.api';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  classID?: string;
  refetchClassStudents?: () => void;
}

export function StudentTable({
  students,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  classID,
  refetchClassStudents,
}: StudentTableProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleDeleteFromClass = async (studentId: string) => {
    if (!classID) return;
    setDeletingId(studentId);
    try {
      await removeStudentFromClass(classID, [studentId]);
      if (refetchClassStudents) refetchClassStudents();
    } catch {
      alert('Xóa học sinh khỏi lớp thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDelete = async (studentId: string) => {
    setDeletingId(studentId);
    try {
      await removeStudent(studentId);
      if (onDelete) onDelete(studentId);
      if (refetchClassStudents) refetchClassStudents();
    } catch {
      alert('Xóa học sinh thất bại!');
    } finally {
      setDeletingId(null);
    }
  };

  // Add debug logging
  console.log('StudentTable received:', {
    studentsLength: students?.length,
    students,
    currentPage,
    totalPages,
  });

  // Explicit null check
  if (!students) {
    console.error('StudentTable: students prop is null or undefined');
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã HS</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Phụ huynh</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Lỗi: Không có dữ liệu học sinh
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã HS</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Giới tính</TableHead>
              <TableHead>Phụ huynh</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Không tìm thấy học sinh nào
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      {/* Debug info */}
      <div className="text-sm text-gray-500 mb-4">Đang hiển thị {students.length} học sinh</div>

      <div className="rounded-md border">
        <Table className="min-w-full divide-y divide-gray-200 text-xs">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Mã HS
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Họ và tên
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Lớp
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Ngày sinh
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Giới tính
              </TableHead>
              <TableHead className="px-2 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">
                Phụ huynh
              </TableHead>
              <TableHead className="px-2 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <TableRow key={student.studentId} className="hover:bg-gray-50">
                <TableCell
                  className="px-2 py-2 whitespace-nowrap font-mono text-xs text-blue-700 cursor-pointer"
                  title="Click để copy"
                  onClick={() => navigator.clipboard.writeText(student.studentId)}
                >
                  {student.studentId}
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 flex-shrink-0">
                      <img className="h-8 w-8 rounded-full" src={student.avatarUrl} alt="" />
                    </div>
                    <div className="ml-2">
                      <div className="text-xs font-medium text-gray-900">{student.fullName}</div>
                      <div className="text-xs text-gray-500">
                        {student.firstName} {student.lastName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{student.email}</div>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5"
                  >
                    {student.className || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">
                    {student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                      : '-'}
                  </div>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{student.gender || '-'}</div>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap">
                  <div className="text-xs text-gray-900">{student.parentName}</div>
                </TableCell>
                <TableCell className="px-2 py-2 whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(student)}
                      className="text-blue-600 hover:text-blue-900 px-1"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(student)}
                      className="text-indigo-600 hover:text-indigo-900 px-1"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        classID
                          ? handleDeleteFromClass(student.studentId)
                          : handleDelete(student.studentId)
                      }
                      className="text-red-600 hover:text-red-900 px-1"
                      disabled={deletingId === student.studentId}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {currentPage + 1} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </div>

      <StudentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        student={selectedStudent}
        onSubmit={() => {}} // We don't need this for view mode
      />
    </div>
  );
}
