'use client';

import { Badge } from '@/components/common/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const courses = [
  {
    id: 1,
    name: 'Toán học 12',
    teacher: 'Thầy Nguyễn Văn A',
    students: 45,
    progress: 75,
    status: 'active',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    name: 'Vật lý 11',
    teacher: 'Cô Trần Thị B',
    students: 38,
    progress: 60,
    status: 'active',
    color: 'bg-green-500',
  },
  {
    id: 3,
    name: 'Hóa học 10',
    teacher: 'Thầy Lê Văn C',
    students: 42,
    progress: 90,
    status: 'completed',
    color: 'bg-purple-500',
  },
  {
    id: 4,
    name: 'Ngữ văn 12',
    teacher: 'Cô Phạm Thị D',
    students: 40,
    progress: 45,
    status: 'active',
    color: 'bg-orange-500',
  },
  {
    id: 5,
    name: 'Tiếng Anh 11',
    teacher: 'Ms. Johnson',
    students: 35,
    progress: 30,
    status: 'active',
    color: 'bg-pink-500',
  },
];

export function CourseProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tiến độ khóa học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.teacher}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={course.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {course.status === 'completed' ? 'Hoàn thành' : 'Đang học'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{course.students} HS</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={course.progress} className="flex-1" />
                <span className="text-sm font-medium">{course.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
