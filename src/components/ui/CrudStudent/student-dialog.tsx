'use client';

import { StudentForm } from './student-form';
import type { Student, StudentFormData } from '@/types/student';
import { SimpleDialog } from '@/components/ui/CrudStudent/simple-dialog';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
  onSubmit: (formData: StudentFormData) => void;
}

export function StudentDialog({ open, onOpenChange, student, onSubmit }: StudentDialogProps) {
  const handleSubmit = (formData: StudentFormData) => {
    onSubmit(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <SimpleDialog
      open={open}
      onOpenChange={onOpenChange}
      title={student ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
      description={
        student
          ? 'Cập nhật thông tin học sinh. Nhấn lưu khi hoàn tất.'
          : 'Nhập thông tin học sinh mới. Các trường có dấu * là bắt buộc.'
      }
      className="max-w-2xl"
    >
      <StudentForm student={student} onSubmit={handleSubmit} onCancel={handleCancel} />
    </SimpleDialog>
  );
}
