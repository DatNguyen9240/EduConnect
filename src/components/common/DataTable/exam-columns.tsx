'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Exam } from '@/types/exam';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const examColumns: ColumnDef<Exam>[] = [
  {
    accessorKey: 'subjectName',
    header: 'Môn học',
  },
  {
    accessorKey: 'subjectCode',
    header: 'Mã môn',
  },
  {
    accessorKey: 'examType',
    header: 'Loại kiểm tra',
  },
  {
    accessorKey: 'examDate',
    header: 'Ngày thi',
    cell: (row) => {
      const dateString = row.getValue() as string;
      return formatDate(dateString);
    },
  },
  {
    accessorKey: 'gradeDate',
    header: 'Ngày trả điểm',
    cell: (row) => {
      const dateString = row.getValue() as string;
      return formatDate(dateString);
    },
  },
  {
    accessorKey: 'room',
    header: 'Phòng thi',
  },
  {
    accessorKey: 'examNote',
    header: 'Ghi chú',
  },
];
