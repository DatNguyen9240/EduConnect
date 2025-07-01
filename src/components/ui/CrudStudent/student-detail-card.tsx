'use client';

import { Calendar, MapPin, Phone, Mail, User, Users } from 'lucide-react';
import {
  SimpleCard,
  SimpleCardContent,
  SimpleCardHeader,
  SimpleCardTitle,
} from '@/components/ui/CrudStudent/simple-card';
import { SimpleBadge } from '@/components/ui/CrudStudent/simple-badge';
import type { Student } from '@/types/student';

interface StudentDetailCardProps {
  student: Student;
}

export function StudentDetailCard({ student }: StudentDetailCardProps) {
  return (
    <SimpleCard>
      <SimpleCardHeader>
        <div className="flex items-center justify-between">
          <SimpleCardTitle className="text-xl">{student.fullName}</SimpleCardTitle>
          <SimpleBadge variant="outline">{student.className}</SimpleBadge>
        </div>
      </SimpleCardHeader>
      <SimpleCardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Mã HS:</span>
            <span className="font-medium">{student.studentID}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Ngày sinh:</span>
            <span className="font-medium">
              {student.dateOfBirth
                ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN')
                : '-'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Giới tính:</span>
            <span className="font-medium">{student.gender}</span>
          </div>

          {student.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{student.email}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Địa chỉ:</span>
            <span className="font-medium">{student.address}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Thông tin phụ huynh
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Tên:</span>
              <span className="font-medium">{student.parentName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">SĐT:</span>
              <span className="font-medium">{student.parentPhone}</span>
            </div>
          </div>
        </div>
      </SimpleCardContent>
    </SimpleCard>
  );
}
