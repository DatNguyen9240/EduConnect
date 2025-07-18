import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { getStudentsByClassID } from '@/api/class.api';

import { Button } from '@/components/common/Button';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useClassList } from '@/hooks/useClassList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Select from 'react-select';

interface AddExamDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Giả lập subjectId, bạn nên lấy từ BE thực tế
const SUBJECTS = [
  { value: 1, label: 'Toán' },
  { value: 2, label: 'Ngữ Văn' },
  { value: 3, label: 'Tiếng Anh' },
  { value: 4, label: 'Vật Lý' },
  { value: 5, label: 'Hóa Học' },
  { value: 6, label: 'Sinh Học' },
  { value: 7, label: 'Lịch Sử' },
  { value: 8, label: 'Địa Lý' },
  { value: 9, label: 'Tin Học' },
  { value: 10, label: 'GDCD' },
  { value: 11, label: 'Thể Dục' },
];

const EXAM_TYPES = [
  { value: '15p', label: '15 phút' },
  { value: '1 tiết', label: '1 tiết' },
  { value: 'Miệng', label: 'Miệng' },
  { value: 'Cuối Kì', label: 'Cuối Kì' },
];

type ClassOption = { classId: string | number; className: string };

export default function AddExamDialog({ open, onClose, onSuccess }: AddExamDialogProps) {
  const { userInfo } = useContext(AppContext);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [examDate, setExamDate] = useState('');
  const [gradeDate, setGradeDate] = useState('');
  const [examType, setExamType] = useState('');
  const [room, setRoom] = useState('');
  const [examNote, setExamNote] = useState('');
  const { data: classListData } = useClassList();
  const classOptions = classListData?.data?.items || [];

  // State cho danh sách học sinh và chọn học sinh
  const [students, setStudents] = useState<{ studentId: string | number; fullName: string }[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);

  // Khi chọn classId, load danh sách học sinh
  useEffect(() => {
    if (classId) {
      getStudentsByClassID(Number(classId)).then((res) => {
        setStudents(
          (res.data || []).map((stu) => ({
            studentId: stu.studentId,
            fullName: String(stu.fullName ?? ''),
          }))
        );
        console.log('Danh sách học sinh:', res.data);
      });
    } else {
      setStudents([]);
      setStudentIds([]);
    }
  }, [classId]);

  const mutation = useMutation<unknown, Error, void>({
    mutationFn: () => {
      const payload = {
        subjectId: typeof subjectId === 'string' ? Number(subjectId) : subjectId,
        examType,
        examNote,
        examDate: examDate ? new Date(examDate).toISOString() : '',
        gradeDate: gradeDate ? new Date(gradeDate).toISOString() : '',
        room,
        principalAccountId: userInfo?.userId || userInfo?.id || '',
        studentIds,
      };
      console.log('Tạo lịch thi - payload gửi lên:', payload);
      return api.post('/api/v1/exams/principal-schedules', payload);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync();
      onSuccess();
      onClose();
      // Reset form
      setClassId('');
      setSubjectId('');
      setExamDate('');
      setGradeDate('');
      setExamType('');
      setRoom('');
      setExamNote('');
      setStudentIds([]);
    } catch (err) {
      console.error(err);
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
          <DialogTitle>Tạo lịch thi mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Lớp</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
            >
              <option value="">Chọn lớp</option>
              {classOptions.map((cls: ClassOption) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Môn học</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              required
            >
              <option value="">Chọn môn</option>
              {SUBJECTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày thi</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Loại kiểm tra</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              required
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
            <label className="block font-medium mb-1">Phòng thi</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Nhập phòng thi"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ghi chú</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={examNote}
              onChange={(e) => setExamNote(e.target.value)}
              placeholder="Nhập ghi chú (nếu có)"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Ngày trả điểm</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={gradeDate}
              onChange={(e) => setGradeDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Chọn học sinh</label>
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
            <div className="text-xs text-gray-500 mt-1">Đã chọn {studentIds.length} học sinh</div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Tạo lịch thi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
