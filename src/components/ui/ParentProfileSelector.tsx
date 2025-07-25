import { useEffect, useState, useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { getParentInfo } from '@/api/auth.api';
import { getStudentsByParentId } from '@/api/profile.api';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { Button } from '../common/Button';
import type { Student } from '@/types/student';

export default function ParentProfileSelector({
  onSelect,
  onClose,
}: {
  onSelect?: () => void;
  onClose?: () => void;
}) {
  const { userInfo } = useContext(AppContext);
  const { setSelectedStudent } = useSelectedStudent();
  const [parentId, setParentId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (userInfo?.role === 'Parent') {
      getParentInfo().then((res) => {
        setParentId(res.data.id);
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (parentId) {
      setLoadingStudents(true);
      getStudentsByParentId(parentId, {
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'FullName',
        ascending: true,
      }).then((res) => {
        setStudents(res.data as Student[]);
        setLoadingStudents(false);
      });
    }
  }, [parentId]);

  const handleSelect = (student: Student) => {
    setSelectedStudent(null);
    setTimeout(() => {
      setSelectedStudent(student);
      if (onSelect) onSelect();
    }, 0);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div
        className="w-full max-w-4xl bg-white shadow-lg border-0 rounded-xl"
        style={{ minWidth: 600, minHeight: 500, position: 'relative' }}
      >
        {onClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        )}
        <div className="p-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Chọn tài khoản con của bạn!</h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
              Logged in users can view full business profiles and can save contact details.
            </p>
          </div>
          <div className="flex gap-8 justify-center flex-wrap">
            {loadingStudents ? (
              <div>Loading students...</div>
            ) : (
              students.map((student) => (
                <div key={student.studentId} className="flex flex-col items-center space-y-4">
                  <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                    <img
                      src={student.avatarUrl || '/placeholder.svg?height=160&width=160'}
                      alt={student.fullName}
                      width={160}
                      height={160}
                      className="w-[148px] h-[148px] rounded-full object-cover border-4 border-blue-600 shadow"
                      style={{ display: 'block', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{student.fullName}</h3>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => handleSelect(student)}
                    >
                      Chọn
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
