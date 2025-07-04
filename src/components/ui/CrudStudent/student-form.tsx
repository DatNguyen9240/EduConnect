'use client';

import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { SimpleLabel } from '@/components/ui/CrudStudent/simple-label';
import { SimpleSelect, SimpleSelectItem } from '@/components/ui/CrudStudent/simple-select';
import type { Class, Student, StudentFormData } from '@/types/student';
import { useSimpleToast } from '@/hooks/Toast/use-simple-toast';

// Import constants và data
import { GENDER_OPTIONS, VALIDATION_MESSAGES } from '@/constants/student';

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (formData: StudentFormData) => void;
  onCancel: () => void;
  classes: Class[];
}

export function StudentForm({ student, onSubmit, onCancel, classes }: StudentFormProps) {
  const { toast } = useSimpleToast();

  const [formData, setFormData] = useState<StudentFormData>({
    studentId: student?.studentId || '',
    fullName: student?.fullName || '',
    dateOfBirth: student?.dateOfBirth || '',
    gender: student?.gender || '',
    classID: student?.classID ? String(student.classID) : '',
    className: student?.className || '',
    parentID: student?.parentID || '',
    parentName: student?.parentName || '',
    parentPhone: student?.parentPhone || '',
    address: student?.address || '',
    email: student?.email || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.studentId || !formData.classID || !formData.parentName) {
      toast({
        title: 'Lỗi',
        description: VALIDATION_MESSAGES.REQUIRED_FIELDS,
        variant: 'destructive',
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <SimpleLabel htmlFor="firstName" required>
              Họ
            </SimpleLabel>
            <Input
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData((prev) => ({ ...prev, studentID: e.target.value }))}
              placeholder="Nhập họ"
            />
          </div>
          <div className="grid gap-2">
            <SimpleLabel htmlFor="fullName" required>
              Tên
            </SimpleLabel>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Nhập tên"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <SimpleLabel required>Lớp</SimpleLabel>
            <SimpleSelect
              value={formData.classID}
              onValueChange={(value) => {
                const selectedClass = classes.find((c) => c.id === value);
                setFormData((prev) => ({
                  ...prev,
                  classID: value,
                  className: selectedClass?.name || '',
                }));
              }}
              placeholder="Chọn lớp"
            >
              {classes.map((c) => (
                <SimpleSelectItem key={c.id} value={c.id}>
                  {c.name}
                </SimpleSelectItem>
              ))}
            </SimpleSelect>
          </div>
          <div className="grid gap-2">
            <SimpleLabel htmlFor="dateOfBirth" required>
              Ngày sinh
            </SimpleLabel>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <SimpleLabel required>Giới tính</SimpleLabel>
            <SimpleSelect
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
              placeholder="Chọn giới tính"
            >
              {GENDER_OPTIONS.map((option) => (
                <SimpleSelectItem key={option.value} value={option.value}>
                  {option.label}
                </SimpleSelectItem>
              ))}
            </SimpleSelect>
          </div>
          <div className="grid gap-2">
            <SimpleLabel htmlFor="email">Email học sinh</SimpleLabel>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Thông tin phụ huynh</h4>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <SimpleLabel htmlFor="parentName" required>
                Tên phụ huynh
              </SimpleLabel>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => setFormData((prev) => ({ ...prev, parentName: e.target.value }))}
                placeholder="Nhập tên phụ huynh"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">{student ? 'Cập nhật' : 'Thêm mới'}</Button>
      </div>
    </form>
  );
}
