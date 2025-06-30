'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/Dialog';
import type { Student } from '@/types/student';
import { useStudentDetail } from '@/hooks/Student/use-student-detail';

interface StudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSubmit: (data: any) => void;
}

export function StudentDialog({ open, onOpenChange, student }: StudentDialogProps) {
  const { data: detailedStudent, isLoading, error } = useStudentDetail(student?.studentID);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (e) {
      return '-';
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('vi-VN');
    } catch (e) {
      return '-';
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isLoading
              ? 'Đang tải thông tin...'
              : error
                ? 'Lỗi'
                : `Thông tin học sinh: ${detailedStudent?.fullName || student?.fullName}`}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải thông tin chi tiết...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            <p>{error.message}</p>
          </div>
        ) : detailedStudent ? (
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="col-span-2 flex items-center space-x-4">
              <img
                src={detailedStudent.avatarUrl}
                alt={detailedStudent.fullName}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{detailedStudent.fullName}</h3>
                <p className="text-gray-500">{detailedStudent.email}</p>
              </div>
            </div>

            <InfoItem label="Mã học sinh" value={detailedStudent.studentID} />
            <InfoItem label="Lớp" value={detailedStudent.className} />
            <InfoItem label="Họ" value={detailedStudent.lastName} />
            <InfoItem label="Tên" value={detailedStudent.firstName} />
            <InfoItem label="Ngày sinh" value={formatDate(detailedStudent.dateOfBirth)} />
            <InfoItem label="Giới tính" value={detailedStudent.gender} />
            <InfoItem label="Phụ huynh" value={detailedStudent.parentName} />
            <InfoItem
              label="Trạng thái"
              value={detailedStudent.isActive ? 'Đang học' : 'Đã nghỉ'}
              className={detailedStudent.isActive ? 'text-green-600' : 'text-red-600'}
            />
            <InfoItem label="Ngày tạo" value={formatDateTime(detailedStudent.createdAt)} />
            <InfoItem label="Cập nhật lần cuối" value={formatDateTime(detailedStudent.updatedAt)} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-sm ${className}`}>{value}</p>
    </div>
  );
}
