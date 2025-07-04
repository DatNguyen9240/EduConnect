'use client';

import { Button } from '@/components/common/Button';
import { DataTable } from '@/components/common/DataTable/data-table';
import type { Student } from '@/types/student';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function StudentTable({
  students,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}: StudentTableProps) {
  const columns = [
    {
      header: 'Mã học sinh',
      accessorKey: 'studentID',
    },
    {
      header: 'Họ và tên',
      accessorKey: 'fullName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Lớp',
      accessorKey: 'className',
    },
    {
      header: 'Phụ huynh',
      accessorKey: 'parentName',
    },
    {
      header: 'Thao tác',
      id: 'actions',
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(row.original)}
            title="Xem chi tiết"
            className="h-8 w-8 p-0"
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(row.original)}
            title="Chỉnh sửa"
            className="h-8 w-8 p-0"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original.studentId)}
            title="Xóa"
            className="h-8 w-8 p-0"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (students.length === 0) {
    return (
      <div className="rounded-md border">
        <DataTable columns={columns} data={students} />
      </div>
    );
  }

  return (
    <div>
      <DataTable columns={columns} data={students} />

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
    </div>
  );
}
