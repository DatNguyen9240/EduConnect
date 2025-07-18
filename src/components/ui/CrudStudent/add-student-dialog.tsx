import { useState } from 'react';
import { SimpleDialog } from './simple-dialog';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { addStudentsToClass } from '@/api/class.api';
import { useClassList } from '@/hooks/useClassList';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/common/Select';

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddStudentDialog({ open, onOpenChange, onSuccess }: AddStudentDialogProps) {
  const [studentID, setStudentID] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: classListData } = useClassList();
  const classOptions = classListData?.data?.items || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!selectedClass) {
      setError('Vui lòng chọn lớp');
      setLoading(false);
      return;
    }
    try {
      await addStudentsToClass(selectedClass, [studentID]);
      setSuccess(true);
      setStudentID('');
      setSelectedClass('');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || 'Đã có lỗi xảy ra');
      } else {
        setError('Đã có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimpleDialog open={open} onOpenChange={onOpenChange} title="Thêm học sinh vào lớp">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
          placeholder="Nhập mã học sinh (studentID)"
          required
        />
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn lớp" />
          </SelectTrigger>
          <SelectContent>
            {classOptions.map((cls: { classId: string | number; className: string }) => (
              <SelectItem key={cls.classId} value={cls.classId.toString()}>
                {cls.className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Thêm học sinh thành công!</div>}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading || !studentID || !selectedClass}>
            {loading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </div>
      </form>
    </SimpleDialog>
  );
}
