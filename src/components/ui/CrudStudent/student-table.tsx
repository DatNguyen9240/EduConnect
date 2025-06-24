'use client';

import { Button } from '@/components/common/Button/index';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Trash2, Edit } from 'lucide-react';
import type { Student } from '@/types/student';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
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
              <TableHead>SĐT PH</TableHead>
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
            <TableHead>SĐT PH</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.studentId}</TableCell>
              <TableCell className="font-medium">{student.fullName}</TableCell>
              <TableCell>
                <Badge variant="outline">{student.className}</Badge>
              </TableCell>
              <TableCell>
                {student.dateOfBirth
                  ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                  : '-'}
              </TableCell>
              <TableCell>{student.gender || '-'}</TableCell>
              <TableCell>{student.parentName || '-'}</TableCell>
              <TableCell>{student.parentPhone || '-'}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(student)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(student.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
