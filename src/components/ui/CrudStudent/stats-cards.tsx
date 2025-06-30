'use client';

import { Users, GraduationCap } from 'lucide-react';
import {
  SimpleCard,
  SimpleCardContent,
  SimpleCardHeader,
  SimpleCardTitle,
} from '@/components/ui/CrudStudent/simple-card';
import type { Student } from '@/types/student';
import { getStudentStats } from '@/ultils/Student/student-utils';

interface StatsCardsProps {
  students: Student[];
}

export function StatsCards({ students }: StatsCardsProps) {
  const stats = getStudentStats(students, []);

  const cards = [
    {
      title: 'Tổng học sinh',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Khối 10',
      value: stats.byGrade[10],
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Khối 11',
      value: stats.byGrade[11],
      icon: GraduationCap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Khối 12',
      value: stats.byGrade[12],
      icon: GraduationCap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <SimpleCard key={card.title}>
            <SimpleCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <SimpleCardTitle className="text-sm font-medium">{card.title}</SimpleCardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </SimpleCardHeader>
            <SimpleCardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {card.title === 'Tổng học sinh' ? 'học sinh' : 'học sinh'}
              </p>
            </SimpleCardContent>
          </SimpleCard>
        );
      })}
    </div>
  );
}
