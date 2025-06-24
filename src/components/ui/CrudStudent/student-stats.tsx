'use client';

import { Badge } from '@/components/common/Badge';
import { Users } from 'lucide-react';

interface StudentStatsProps {
  totalStudents: number;
}

export function StudentStats({ totalStudents }: StudentStatsProps) {
  return (
    <div className="flex items-center gap-2">
      <Users className="h-5 w-5" />
      <Badge variant="secondary">{totalStudents} học sinh</Badge>
    </div>
  );
}
