'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function GradeChart() {
  const subjects = [
    { name: 'Toán', average: 8.5, students: 120 },
    { name: 'Lý', average: 7.8, students: 95 },
    { name: 'Hóa', average: 8.2, students: 88 },
    { name: 'Sinh', average: 8.0, students: 75 },
    { name: 'Văn', average: 7.5, students: 150 },
    { name: 'Anh', average: 8.3, students: 140 },
    { name: 'Sử', average: 7.9, students: 110 },
    { name: 'Địa', average: 8.1, students: 105 },
  ];

  const maxAverage = Math.max(...subjects.map((s) => s.average));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Điểm trung bình theo môn học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-xs text-muted-foreground">({subject.students} HS)</span>
                </div>
                <span className="font-semibold text-blue-600">{subject.average}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(subject.average / maxAverage) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
