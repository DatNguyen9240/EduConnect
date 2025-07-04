import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { useGrades } from '@/hooks/useGrades';
import type { UserInfo } from '@/contexts/app.context';
import type { Student } from '@/types/student';
import { DataTable } from './DataTable/data-table';
import { scoreColumns, type ScoreRow } from './DataTable/score-columns';
// Định nghĩa trực tiếp type Grade nếu chưa có file types/grade
interface Grade {
  gradeID: number;
  studentID: string;
  studentName: string;
  subjectID: number;
  subjectName: string;
  classID: number;
  className: string;
  score: number;
  gradeType: string;
  gradeLevel: number;
  semester: string;
  evaluation: string;
  createdDate: string | null;
  updatedDate: string | null;
}

const SUBJECTS = [
  'Toán',
  'Ngữ Văn',
  'Tin Học',
  'Lịch Sử',
  'Địa Lý',
  'Vật Lý',
  'Hóa Học',
  'Sinh Học',
  'Tiếng Anh',
  'GDCD',
  'Thể Dục',
];

function getStudentId(userInfo: UserInfo | null, selectedStudent: Student | null): string {
  if (!userInfo) return '';
  if (userInfo.role === 'Student') {
    try {
      const profile = JSON.parse(localStorage.getItem('profile') || '{}');
      return profile.id || '';
    } catch {
      return '';
    }
  }
  if (userInfo.role === 'Parent') {
    try {
      const student =
        selectedStudent || JSON.parse(localStorage.getItem('selectedStudent') || '{}');
      return student.studentId || '';
    } catch {
      return '';
    }
  }
  return '';
}

export default function ScoreTable() {
  const { userInfo } = useContext(AppContext);
  const { selectedStudent } = useSelectedStudent();
  const studentId = getStudentId(userInfo, selectedStudent);
  const { data, isLoading, isError } = useGrades(studentId, !!studentId);
  const grades: Grade[] = data?.data || [];

  // Map dữ liệu điểm số theo môn học và loại điểm
  const subjectRows: ScoreRow[] = SUBJECTS.map((subject) => {
    const subjectGrades = grades.filter((g) => g.subjectName === subject);
    return {
      subject,
      oral: subjectGrades.find((g) => g.gradeType === 'Miệng')?.score ?? '',
      fifteen: subjectGrades.find((g) => g.gradeType === '15p')?.score ?? '',
      period: subjectGrades.find((g) => g.gradeType === '1 tiết')?.score ?? '',
      final: subjectGrades.find((g) => g.gradeType === 'Cuối Kì')?.score ?? '',
      avg:
        subjectGrades.length > 0
          ? (
              subjectGrades.reduce(
                (sum, g) => sum + (typeof g.score === 'number' ? g.score : 0),
                0
              ) / subjectGrades.length
            ).toFixed(2)
          : '',
      note: subjectGrades
        .map((g) => g.evaluation)
        .filter(Boolean)
        .join('; '),
    };
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
      <DataTable columns={scoreColumns} data={subjectRows} isLoading={isLoading} />
      {isError && (
        <div className="text-red-600 text-center mt-4">Không lấy được dữ liệu điểm số.</div>
      )}
    </div>
  );
}
