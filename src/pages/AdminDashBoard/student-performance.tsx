'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/common/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/common/Table';

const topStudents = [
  {
    id: 'HS001',
    name: 'Nguyễn Minh Anh',
    class: '12A1',
    avgScore: 9.2,
    status: 'excellent',
    avatar: '/placeholder.svg?height=32&width=32',
    subjects: ['Toán', 'Lý', 'Hóa'],
  },
  {
    id: 'HS002',
    name: 'Trần Văn Bình',
    class: '11B2',
    avgScore: 8.8,
    status: 'good',
    avatar: '/placeholder.svg?height=32&width=32',
    subjects: ['Văn', 'Sử', 'Địa'],
  },
  {
    id: 'HS003',
    name: 'Lê Thị Cẩm',
    class: '10C3',
    avgScore: 8.5,
    status: 'good',
    avatar: '/placeholder.svg?height=32&width=32',
    subjects: ['Sinh', 'Hóa', 'Toán'],
  },
  {
    id: 'HS004',
    name: 'Phạm Đức Duy',
    class: '12A2',
    avgScore: 7.8,
    status: 'average',
    avatar: '/placeholder.svg?height=32&width=32',
    subjects: ['Toán', 'Lý', 'Anh'],
  },
  {
    id: 'HS005',
    name: 'Hoàng Thị Ế',
    class: '11A1',
    avgScore: 9.0,
    status: 'excellent',
    avatar: '/placeholder.svg?height=32&width=32',
    subjects: ['Văn', 'Anh', 'Pháp'],
  },
];

const statusColors = {
  excellent: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  average: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800',
};

const statusLabels = {
  excellent: 'Xuất sắc',
  good: 'Giỏi',
  average: 'Khá',
  poor: 'Yếu',
};

export function StudentPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Học sinh xuất sắc</span>
          <Badge variant="secondary">Top 5</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học sinh</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Điểm TB</TableHead>
              <TableHead>Xếp loại</TableHead>
              <TableHead>Môn học</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar || '/placeholder.svg'} />
                      <AvatarFallback>
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{student.class}</TableCell>
                <TableCell>
                  <span className="font-semibold text-green-600">{student.avgScore}</span>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[student.status as keyof typeof statusColors]}>
                    {statusLabels[student.status as keyof typeof statusLabels]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {student.subjects.slice(0, 2).map((subject) => (
                      <Badge key={subject} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                    {student.subjects.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{student.subjects.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
