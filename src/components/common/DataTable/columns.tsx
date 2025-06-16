'use client';

import type { ColumnDef } from '@tanstack/react-table';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  subject: string;
  testType: '15 phút' | '1 tiết' | 'Giữa kỳ' | 'Cuối kỳ';
  examDate: Date;
  releaseDay: Date;
  status: 'pending' | 'processing' | 'success' | 'failed';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'subject',
    header: 'Môn',
  },
  {
    accessorKey: 'testType',
    header: 'Loại kiểm tra',
  },
  {
    accessorKey: 'examDate',
    header: 'Ngày thi',
    cell: (row) => {
      const date = row.getValue();
      // You can now use 'date' as needed, for example:
      return formatDate(date as Date);
    },
  },
  {
    accessorKey: 'releaseDay',
    header: 'Ngày trả điểm',
    cell: (row) => {
      const date = row.getValue();
      // You can now use 'date' as needed, for example:
      return formatDate(date as Date);
    },
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
  },
];
