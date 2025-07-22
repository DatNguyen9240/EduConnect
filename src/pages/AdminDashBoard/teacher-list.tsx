import { useTeachers } from '@/hooks/useTeachers';
import type { Teacher } from '@/types/teacher';

export default function TeacherList() {
  const { data, isLoading, error } = useTeachers({
    pageIndex: 0,
    pageSize: 10,
    sortBy: 'FullName',
    ascending: true,
  });

  if (isLoading) return <div>Đang tải danh sách giáo viên...</div>;
  if (error) return <div className="text-red-500">Lỗi khi tải danh sách giáo viên</div>;

  return (
    <div className="space-y-4">
      {data && data.data && data.data.length > 0 ? (
        data.data.map((teacher: Teacher) => (
          <div key={teacher.teacherId} className="flex items-center gap-4 border-b pb-2 mb-2">
            <img
              src={teacher.avatarUrl}
              alt={teacher.fullName}
              className="w-10 h-10 rounded-full object-cover border"
              onError={(e) => (e.currentTarget.src = '/assets/avatar/default.jpg')}
            />
            <div>
              <div className="font-semibold text-blue-700">{teacher.fullName}</div>
              <div className="text-gray-600 text-sm">{teacher.email}</div>
            </div>
          </div>
        ))
      ) : (
        <div>Không có giáo viên nào.</div>
      )}
    </div>
  );
}
