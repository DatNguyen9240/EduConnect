import { useState, useEffect, useCallback, useContext } from 'react';
import { type FilterOption } from './FilterGroup';
import { AppContext } from '@/contexts/app.context';

interface TaskFilterExamProps {
  onChange?: (filters: Record<string, unknown>) => void;
  current?: {
    startDate: string;
    endDate: string;
    studentId?: string;
    searchTerm?: string;
    sortBy?: string;
    ascending: boolean;
  };
}

export default function TaskFilterExam({ onChange, current }: TaskFilterExamProps) {
  const { hasRole, isAdmin } = useContext(AppContext);
  // Principal có thể là Admin hoặc có role Principal cụ thể
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');

  const [semester, setSemester] = useState('all');
  const [subject, setSubject] = useState('all');
  const [status, setStatus] = useState('all');
  const [studentId, setStudentId] = useState(current?.studentId || '');
  const [sortBy, setSortBy] = useState(current?.sortBy || 'examDate');
  const [ascending, setAscending] = useState(current?.ascending ?? true);

  // Default date range: từ đầu năm đến cuối năm hiện tại
  const currentYear = new Date().getFullYear();
  const defaultStartDate = `${currentYear}-01-01`;
  const defaultEndDate = `${currentYear}-12-31`;

  const [startDate, setStartDate] = useState(current?.startDate || defaultStartDate);
  const [endDate, setEndDate] = useState(current?.endDate || defaultEndDate);

  // Memoize the onChange callback to prevent unnecessary re-renders
  const handleFilterChange = useCallback(
    (newFilters: Record<string, unknown>) => {
      if (onChange) {
        onChange({
          startDate,
          endDate,
          studentId,
          searchTerm: current?.searchTerm || '',
          sortBy,
          ascending,
          ...newFilters,
        });
      }
    },
    [onChange, startDate, endDate, studentId, current?.searchTerm, sortBy, ascending]
  );

  // Handle startDate change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    handleFilterChange({ startDate: newStartDate });
  };

  // Handle endDate change
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    handleFilterChange({ endDate: newEndDate });
  };

  // Handle student filter change (only for Principal)
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStudentId = e.target.value;
    setStudentId(newStudentId);
    handleFilterChange({ studentId: newStudentId === 'all' ? undefined : newStudentId });
  };

  // Handle ascending change
  const handleAscendingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAscending = e.target.value === 'true';
    setAscending(newAscending);
    handleFilterChange({ ascending: newAscending });
  };

  // Update local state when current prop changes (but only if different)
  useEffect(() => {
    if (current?.startDate && current.startDate !== startDate) {
      setStartDate(current.startDate);
    }
    if (current?.endDate && current.endDate !== endDate) {
      setEndDate(current.endDate);
    }
    if (current?.studentId !== studentId) {
      setStudentId(current?.studentId || '');
    }
    if (current?.sortBy !== sortBy) {
      setSortBy(current?.sortBy || 'examDate');
    }
    if (current?.ascending !== ascending) {
      setAscending(current?.ascending ?? true);
    }
  }, [current, startDate, endDate, studentId, sortBy, ascending]);

  const semesterOptions: FilterOption[] = [
    { label: 'Chọn học kì', value: 'all' },
    { label: 'Học kì 1', value: '1' },
    { label: 'Học kì 2', value: '2' },
  ];

  const subjectOptions: FilterOption[] = [
    { label: 'Chọn môn', value: 'all' },
    { label: 'Toán', value: '1' },
    { label: 'Lý', value: '2' },
    { label: 'Hóa', value: '3' },
    { label: 'Anh', value: '4' },
  ];

  const statusOptions: FilterOption[] = [
    { label: 'Chọn trạng thái', value: 'all' },
    { label: 'Đã hoàn thành', value: '1' },
    { label: 'Đang chờ', value: '2' },
    { label: 'Đã hủy', value: '3' },
  ];

  const ascendingOptions: FilterOption[] = [
    { label: 'Tăng dần', value: 'true' },
    { label: 'Giảm dần', value: 'false' },
  ];

  // Mock student data - trong thực tế sẽ lấy từ API
  const studentOptions: FilterOption[] = [
    { label: 'Tất cả học sinh', value: 'all' },
    { label: 'Nguyễn Văn A', value: 'student1' },
    { label: 'Trần Thị B', value: 'student2' },
    { label: 'Lê Văn C', value: 'student3' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Lịch Thi</h2>
      <div className="bg-white shadow-md border border-blue-100 rounded-xl p-6">
        {/* Hàng 1: Date Range và Student Filter */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Student Filter (only for Principal) */}
          {isPrincipal && (
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Học sinh</label>
              <select
                value={studentId || 'all'}
                onChange={handleStudentChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {studentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Hàng 2: Sorting Options và Other Filters */}
        <div className="grid grid-cols-5 gap-4 mb-4 items-end">
          <div className="flex flex-col w-full min-w-[120px]">
            <label className="text-sm font-medium text-gray-700 mb-1">Ngày thi</label>
            <select
              value={ascending.toString()}
              onChange={handleAscendingChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {ascendingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <label className="text-sm font-medium text-gray-700 mb-1">Học Kì</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {semesterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <label className="text-sm font-medium text-gray-700 mb-1">Môn học</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {subjectOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full min-w-[120px]">
            <label className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
