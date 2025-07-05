'use client';

import { Badge } from '@/components/common/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Users } from 'lucide-react';

const assignments = [
  {
    id: 1,
    title: 'Bài kiểm tra Toán - Chương 3',
    subject: 'Toán học',
    dueDate: '2024-01-20',
    dueTime: '14:30',
    class: '12A1',
    students: 45,
    submitted: 32,
    priority: 'high',
  },
  {
    id: 2,
    title: 'Thuyết trình Lịch sử Việt Nam',
    subject: 'Lịch sử',
    dueDate: '2024-01-22',
    dueTime: '10:00',
    class: '11B2',
    students: 38,
    submitted: 15,
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Bài tập về nhà - Phương trình bậc 2',
    subject: 'Toán học',
    dueDate: '2024-01-25',
    dueTime: '08:00',
    class: '10C1',
    students: 40,
    submitted: 28,
    priority: 'low',
  },
  {
    id: 4,
    title: 'Viết luận về môi trường',
    subject: 'Ngữ văn',
    dueDate: '2024-01-18',
    dueTime: '16:00',
    class: '12A2',
    students: 42,
    submitted: 38,
    priority: 'high',
  },
];

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const priorityLabels = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

export function UpcomingAssignments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bài tập sắp đến hạn</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium">{assignment.title}</h4>
                  <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                </div>
                <Badge
                  className={priorityColors[assignment.priority as keyof typeof priorityColors]}
                >
                  {priorityLabels[assignment.priority as keyof typeof priorityLabels]}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{assignment.dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{assignment.dueTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{assignment.class}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-green-600">{assignment.submitted}</span>
                  <span className="text-muted-foreground">/{assignment.students} đã nộp</span>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(assignment.submitted / assignment.students) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
