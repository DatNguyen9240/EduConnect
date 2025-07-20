import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/contexts/app.context';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/common/Button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '@/lib/axios';
import { updateExam } from '@/api/exam.api';
import { getStudentsByClassID } from '@/api/class.api';
import type { Subject } from '@/api/subject.api';
import Select from 'react-select';

export type ExamDetail = {
  examId: number;
  subjectId?: number;
  subjectName: string;
  subjectCode: string;
  examType: string;
  examNote: string;
  examDate: string;
  gradeDate: string;
  room: string;
  studentId: string;
  createdBy: string;
  createdDate: string;
};

// SUBJECTS sẽ được lấy từ API thay vì hardcode

const EXAM_TYPES = [
  { value: '15p', label: '15 phút' },
  { value: '1 tiết', label: '1 tiết' },
  { value: 'Miệng', label: 'Miệng' },
  { value: 'Cuối Kì', label: 'Cuối Kì' },
];

interface ClassOption {
  classId: string | number;
  className: string;
}

function ExamDialog({
  mode,
  exam,
  open,
  onClose,
  onSuccess,
  classOptions = [],
  subjects = [],
}: {
  mode: 'add' | 'edit';
  exam: ExamDetail | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  classOptions?: ClassOption[];
  subjects?: Subject[];
}) {
  const isEdit = mode === 'edit';
  const { userInfo } = useContext(AppContext);
  const { register, handleSubmit, reset } = useForm<
    ExamDetail & { classId?: string; studentIds?: string[] }
  >({
    defaultValues: exam || {},
  });
  // Helper function để format datetime cho input datetime-local
  const formatDateTimeForInput = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return '';

      // Format thành YYYY-MM-DDTHH:mm (loại bỏ seconds và milliseconds)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    if (exam) {
      // Format datetime trước khi reset form
      const formattedExam = {
        ...exam,
        examDate: formatDateTimeForInput(exam.examDate),
        gradeDate: formatDateTimeForInput(exam.gradeDate),
      };
      reset(formattedExam);
    } else {
      reset({});
    }

    // Nếu là edit và exam có thông tin lớp, tự động chọn lớp
    if (isEdit && exam) {
      // Có thể cần thêm logic để lấy classId từ exam nếu có
      // Hiện tại sẽ để user chọn lại lớp
    }
  }, [exam, reset, isEdit]);

  // State cho chọn lớp và học sinh (dùng cho cả add và edit)
  const [classId, setClassId] = useState('');
  const [students, setStudents] = useState<{ studentId: string | number; fullName: string }[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);

  useEffect(() => {
    if (classId) {
      getStudentsByClassID(Number(classId)).then((res) => {
        setStudents(
          (res.data || []).map((stu) => ({
            studentId: stu.studentId,
            fullName: String(stu.fullName ?? ''),
          }))
        );
      });
    } else {
      setStudents([]);
      setStudentIds([]);
    }
  }, [classId]);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: ExamDetail & { classId?: string; studentIds?: string[] }) => {
    setLoading(true);
    try {
      if (isEdit && exam) {
        const payload = {
          subjectId: values.subjectId ?? 0,
          examType: values.examType,
          examNote: values.examNote,
          examDate: values.examDate,
          gradeDate: values.gradeDate,
          room: values.room,
          studentId: values.studentId,
        };
        await updateExam(exam.examId, payload);
        toast.success('Cập nhật lịch thi thành công!');
      } else {
        await api.post('/api/v1/exams/principal-schedules', {
          ...values,
          classId,
          studentIds,
          principalId: userInfo?.id || '',
        });
        toast.success('Tạo lịch thi thành công!');
      }
      onSuccess();
      onClose();
      setClassId('');
      setStudentIds([]);
      setStudents([]);
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message?: string }).message
          : '';
      toast.error((isEdit ? 'Cập nhật' : 'Tạo') + ' lịch thi thất bại! ' + (errorMsg || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Sửa lịch thi' : 'Tạo lịch thi mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trường chọn lớp (cho cả add và edit) */}
          <div>
            <label className="block font-medium mb-1">Lớp</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              <option value="">Chọn lớp</option>
              {classOptions.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>

          {/* Trường chọn học sinh (cho cả add và edit) */}
          <div>
            <label className="block font-medium mb-1">
              {isEdit ? 'Học sinh' : 'Chọn học sinh'}
            </label>
            {isEdit ? (
              <select
                className="w-full border rounded px-3 py-2"
                {...register('studentId')}
                defaultValue={exam?.studentId || ''}
                required
              >
                <option value="">Chọn học sinh</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>
                    {student.fullName}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <Select
                  isMulti
                  options={students.map((stu) => ({ value: stu.studentId, label: stu.fullName }))}
                  value={students
                    .filter((stu) => studentIds.includes(String(stu.studentId)))
                    .map((stu) => ({ value: stu.studentId, label: stu.fullName }))}
                  onChange={(selected) => setStudentIds(selected.map((opt) => String(opt.value)))}
                  placeholder="Chọn học sinh..."
                  classNamePrefix="react-select"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  Đã chọn {studentIds.length} học sinh
                </div>
              </>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Môn học</label>
            <select
              className="w-full border rounded px-3 py-2"
              {...register('subjectId', { valueAsNumber: true })}
              defaultValue={exam?.subjectId || ''}
            >
              <option value="">Chọn môn</option>
              {subjects.map((s) => (
                <option key={s.subjectId} value={s.subjectId}>
                  {s.subjectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Loại kiểm tra</label>
            <select
              className="w-full border rounded px-3 py-2"
              {...register('examType')}
              defaultValue={exam?.examType || ''}
            >
              <option value="">Chọn loại</option>
              {EXAM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Ghi chú</label>
            <input className="w-full border rounded px-3 py-2" {...register('examNote')} />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày thi</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              {...register('examDate')}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày trả điểm</label>
            <input
              type="datetime-local"
              className="w-full border rounded px-3 py-2"
              {...register('gradeDate')}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phòng thi</label>
            <input className="w-full border rounded px-3 py-2" {...register('room')} />
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              {isEdit ? 'Hủy' : 'Đóng'}
            </Button>
            <Button type="submit" isLoading={loading}>
              {isEdit ? 'Cập nhật' : 'Tạo lịch thi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ExamDialog;
