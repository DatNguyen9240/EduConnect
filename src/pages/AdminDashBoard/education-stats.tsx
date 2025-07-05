'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, BookOpen, FileText, Award } from 'lucide-react';

const stats = [
  {
    title: 'Tổng học sinh',
    value: '1,247',
    change: '+5.2%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Khóa học hoạt động',
    value: '24',
    change: '+2 khóa mới',
    trend: 'up',
    icon: BookOpen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Bài tập chờ chấm',
    value: '156',
    change: '-12 bài',
    trend: 'down',
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Điểm trung bình',
    value: '8.2',
    change: '+0.3 điểm',
    trend: 'up',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export function EducationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.trend === 'up' ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {stat.change}
              </span>
              <span className="ml-1">so với tuần trước</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
