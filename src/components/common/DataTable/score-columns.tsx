import type { ColumnDef } from '@tanstack/react-table';

export type ScoreRow = {
  subject: string;
  oral: string | number;
  fifteen: string | number;
  period: string | number;
  final: string | number;
  avg: string | number;
  note: string;
};

export const scoreColumns: ColumnDef<ScoreRow>[] = [
  {
    accessorKey: 'subject',
    header: 'Môn học',
  },
  {
    accessorKey: 'oral',
    header: 'Miệng',
  },
  {
    accessorKey: 'fifteen',
    header: '15p',
  },
  {
    accessorKey: 'period',
    header: '1 tiết',
  },
  {
    accessorKey: 'final',
    header: 'Cuối Kì',
  },
  {
    accessorKey: 'avg',
    header: 'Điểm TB',
  },
  {
    accessorKey: 'note',
    header: 'Ghi chú',
  },
];
