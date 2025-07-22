import { useState, useEffect, useContext } from 'react';
import TimeTable from '@/components/common/TimeTable';
import { AppContext } from '@/contexts/app.context';
import { useTimetable } from '@/hooks/useTimetable';
import { useClassList } from '@/hooks/useClassList';
import { getTimetableByClassId, convertTimetableSlotsToScheduleItems } from '@/api/timetable.api';
import type { Timetable } from '@/api/timetable.api';

const ThoiKhoaBieuPage = () => {
  const { hasRole, isAdmin, isTeacher } = useContext(AppContext);
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');

  // State cho principal chọn lớp và tuần
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [availableWeeks, setAvailableWeeks] = useState<{ start: Date; end: Date; label: string }[]>(
    []
  );
  const [timetableData, setTimetableData] = useState<unknown>(null);
  const [loadingTimetable, setLoadingTimetable] = useState(false);
  const [errorTimetable, setErrorTimetable] = useState<string | null>(null);

  // Lấy danh sách lớp cho principal
  const { data: classListData, isLoading: loadingClassList } = useClassList({
    pageIndex: 0,
    pageSize: 100,
    sortBy: 'ClassName',
    ascending: true,
  });

  // Khi có danh sách lớp, set mặc định class đầu tiên
  useEffect(() => {
    if (
      isPrincipal &&
      classListData &&
      classListData.data.items.length > 0 &&
      selectedClassId === null
    ) {
      setSelectedClassId(classListData.data.items[0].classId);
    }
  }, [isPrincipal, classListData, selectedClassId]);

  // Tính toán các tuần để chọn
  useEffect(() => {
    const today = new Date();
    const getStartOfWeek = (date: Date): Date => {
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diff);
      return monday;
    };
    const getEndOfWeek = (startDate: Date): Date => {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return endDate;
    };
    const createWeekLabel = (startDate: Date, endDate: Date): string => {
      return `Tuần ${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
    };
    const currentWeekStart = getStartOfWeek(today);
    const weeks = [];
    for (let i = -2; i <= 2; i++) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() + i * 7);
      const weekEnd = getEndOfWeek(weekStart);
      const label = createWeekLabel(weekStart, weekEnd);
      weeks.push({ start: weekStart, end: weekEnd, label });
    }
    setAvailableWeeks(weeks);
    setSelectedWeek(currentWeekStart);
  }, []);

  // Khi chọn class hoặc tuần, fetch timetable
  useEffect(() => {
    if (isPrincipal && selectedClassId && selectedWeek) {
      setLoadingTimetable(true);
      setErrorTimetable(null);
      const getStartOfWeek = (date: Date): Date => {
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        return monday;
      };
      const getEndOfWeek = (startDate: Date): Date => {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
      };
      const startDate = getStartOfWeek(selectedWeek).toISOString().split('T')[0];
      const endDate = getEndOfWeek(getStartOfWeek(selectedWeek)).toISOString().split('T')[0];
      getTimetableByClassId(selectedClassId, startDate, endDate)
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setTimetableData(res.data[0]);
          } else if (res.success && !Array.isArray(res.data) && res.data) {
            setTimetableData(res.data);
          } else {
            setTimetableData(null);
          }
        })
        .catch(() => setErrorTimetable('Không thể tải thời khóa biểu'))
        .finally(() => setLoadingTimetable(false));
    }
  }, [isPrincipal, selectedClassId, selectedWeek]);

  // --- Giao diện cho học sinh/phụ huynh/giáo viên ---
  const [studentSelectedWeek, setStudentSelectedWeek] = useState<Date>(new Date());
  const [studentAvailableWeeks, setStudentAvailableWeeks] = useState<
    { start: Date; end: Date; label: string }[]
  >([]);
  useEffect(() => {
    const today = new Date();
    const getStartOfWeek = (date: Date): Date => {
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const monday = new Date(date);
      monday.setDate(date.getDate() + diff);
      return monday;
    };
    const getEndOfWeek = (startDate: Date): Date => {
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return endDate;
    };
    const createWeekLabel = (startDate: Date, endDate: Date): string => {
      return `Tuần ${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
    };
    const currentWeekStart = getStartOfWeek(today);
    const weeks = [];
    for (let i = -2; i <= 2; i++) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(currentWeekStart.getDate() + i * 7);
      const weekEnd = getEndOfWeek(weekStart);
      const label = createWeekLabel(weekStart, weekEnd);
      weeks.push({ start: weekStart, end: weekEnd, label });
    }
    setStudentAvailableWeeks(weeks);
    setStudentSelectedWeek(currentWeekStart);
  }, []);
  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };
  const getEndOfWeek = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return endDate;
  };
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const studentStartDate = studentSelectedWeek
    ? getStartOfWeek(studentSelectedWeek).toISOString().split('T')[0]
    : undefined;
  const studentEndDate = studentSelectedWeek
    ? getEndOfWeek(getStartOfWeek(studentSelectedWeek)).toISOString().split('T')[0]
    : undefined;
  const {
    scheduleItems,
    isLoading,
    error,
    studentName,
    className,
    teacherName,
    isParentWithoutStudent,
    isStudentWithoutClass,
  } = useTimetable(studentStartDate, studentEndDate);

  // --- UI ---
  if (isParentWithoutStudent) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-xl font-semibold text-gray-700 mb-4">
          Vui lòng chọn học sinh để xem thời khóa biểu
        </div>
        <p className="text-gray-500">
          Bạn cần chọn học sinh từ danh sách để xem thời khóa biểu của học sinh đó.
        </p>
      </div>
    );
  }
  if (isStudentWithoutClass) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-xl font-semibold text-gray-700 mb-4">
          Không tìm thấy thông tin lớp học
        </div>
        <p className="text-gray-500">
          Bạn chưa được phân lớp hoặc có lỗi khi tải thông tin lớp học.
        </p>
      </div>
    );
  }

  // Xác định tiêu đề dựa trên vai trò người dùng
  let title = 'Thời khóa biểu';
  if (isTeacher() && teacherName) {
    title = `Thời khóa biểu của giáo viên ${teacherName}`;
  } else if (studentName) {
    title = `Thời khóa biểu của ${studentName}`;
    if (className) {
      title += ` - Lớp ${className}`;
    }
  }

  // --- Giao diện cho principal ---
  if (isPrincipal) {
    return (
      <div className="p-4 sm:p-6 md:p-10">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Thời khóa biểu các lớp</h2>
        <div className="flex gap-2 justify-center mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn lớp:</label>
            <select
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedClassId ?? ''}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
              disabled={loadingClassList}
            >
              {loadingClassList && <option>Đang tải...</option>}
              {classListData?.data.items.map((cls) => (
                <option key={cls.classId} value={cls.classId}>
                  {cls.className}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full max-w-md">
            <label htmlFor="week-select" className="block text-sm font-medium text-gray-700 mb-1">
              Chọn tuần:
            </label>
            <select
              id="week-select"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                const selectedIndex = parseInt(e.target.value, 10);
                const selectedWeekData = availableWeeks[selectedIndex];
                setSelectedWeek(selectedWeekData.start);
              }}
              value={availableWeeks.findIndex(
                (week) => week.start.toDateString() === selectedWeek?.toDateString()
              )}
            >
              {availableWeeks.map((week, index) => (
                <option key={index} value={index}>
                  {week.label}
                </option>
              ))}
            </select>
            <div className="mt-2 text-sm text-gray-600 flex justify-between">
              <span>Từ: {selectedWeek && formatDate(selectedWeek)}</span>
              <span>Đến: {selectedWeek && formatDate(getEndOfWeek(selectedWeek))}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center mb-1 italic">
          <strong>Note:</strong> Thời khóa biểu không bao gồm các hoạt động ngoại khóa
        </p>
        <p className="text-sm text-gray-500 text-center mb-2">
          <strong>Chú thích:</strong> Các hoạt động trong bảng dưới không bao gồm hoạt động câu lạc
          bộ và các hoạt động khác
        </p>
        <a href="#" className="text-sm text-red-600 underline block text-center mb-6">
          Các phòng bắt đầu bằng NVH học tại nhà văn hóa Sinh viên, khu Đại học quốc gia
        </a>
        <div className="flex justify-center w-full overflow-x-auto">
          <div className="min-w-fit">
            {loadingTimetable ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : errorTimetable ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-center">
                {errorTimetable}
              </div>
            ) : timetableData &&
              typeof timetableData === 'object' &&
              'slots' in timetableData &&
              Array.isArray((timetableData as Timetable).slots) &&
              (timetableData as Timetable).slots.length > 0 ? (
              <TimeTable
                data={convertTimetableSlotsToScheduleItems((timetableData as Timetable).slots)}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 w-full min-w-[800px]">
                <div className="text-3xl text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Không có thời khóa biểu</h3>
                <p className="text-gray-500">
                  Không tìm thấy thời khóa biểu cho khoảng thời gian từ{' '}
                  <span className="font-medium">{selectedWeek && formatDate(selectedWeek)}</span>{' '}
                  đến{' '}
                  <span className="font-medium">
                    {selectedWeek && formatDate(getEndOfWeek(selectedWeek))}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Giao diện cho học sinh/phụ huynh/giáo viên ---
  return (
    <div className="p-4 sm:p-6 md:p-10">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">{title}</h2>
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-md">
          <label htmlFor="week-select" className="block text-sm font-medium text-gray-700 mb-1">
            Chọn tuần:
          </label>
          <select
            id="week-select"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => {
              const selectedIndex = parseInt(e.target.value, 10);
              const selectedWeekData = studentAvailableWeeks[selectedIndex];
              setStudentSelectedWeek(selectedWeekData.start);
            }}
            value={studentAvailableWeeks.findIndex(
              (week) => week.start.toDateString() === studentSelectedWeek?.toDateString()
            )}
          >
            {studentAvailableWeeks.map((week, index) => (
              <option key={index} value={index}>
                {week.label}
              </option>
            ))}
          </select>
          <div className="mt-2 text-sm text-gray-600 flex justify-between">
            <span>Từ: {studentSelectedWeek && formatDate(studentSelectedWeek)}</span>
            <span>Đến: {studentSelectedWeek && formatDate(getEndOfWeek(studentSelectedWeek))}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center mb-1 italic">
        <strong>Note:</strong> Thời khóa biểu không bao gồm các hoạt động ngoại khóa
      </p>
      <p className="text-sm text-gray-500 text-center mb-2">
        <strong>Chú thích:</strong> Các hoạt động trong bảng dưới không bao gồm hoạt động câu lạc bộ
        và các hoạt động khác
      </p>
      <a href="#" className="text-sm text-red-600 underline block text-center mb-6">
        Các phòng bắt đầu bằng NVH học tại nhà văn hóa Sinh viên, khu Đại học quốc gia
      </a>
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-center">
          {error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thời khóa biểu'}
        </div>
      )}
      {!isLoading && !error && (
        <div className="flex justify-center w-full overflow-x-auto">
          <div className="min-w-fit">
            {scheduleItems.length > 0 ? (
              <TimeTable data={scheduleItems} />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 w-full min-w-[800px]">
                <div className="text-3xl text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Không có thời khóa biểu</h3>
                <p className="text-gray-500">
                  Không tìm thấy thời khóa biểu cho khoảng thời gian từ{' '}
                  <span className="font-medium">
                    {studentSelectedWeek && formatDate(studentSelectedWeek)}
                  </span>{' '}
                  đến{' '}
                  <span className="font-medium">
                    {studentSelectedWeek && formatDate(getEndOfWeek(studentSelectedWeek))}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mt-6 text-sm text-gray-700 px-4 sm:px-0">
        <p>
          <strong className="text-green-600">(attended)</strong>:{' '}
          {isTeacher() ? 'Đã diễn ra' : `${studentName || 'Học sinh'} đã tham gia hoạt động này`}
        </p>
        <p>
          <strong className="text-red-500">(absent)</strong>:{' '}
          {isTeacher() ? 'Vắng mặt' : `${studentName || 'Học sinh'} không tham gia hoạt động này`}
        </p>
        <p>
          <strong>(Not yet)</strong>: hoạt động chưa diễn ra
        </p>
        <p>
          <strong>(-)</strong>: không có dữ liệu
        </p>
      </div>
      <div className="mt-10 text-xs text-center text-gray-500 border-t pt-4">
        Sinh viên có nhu cầu thực hiện các thủ tục, dịch vụ vui lòng liên hệ Trung tâm Dịch vụ Sinh
        viên tại Phòng 202, điện thoại:{' '}
        <a className="text-blue-600" href="tel:02873005855">
          028.73005855
        </a>
        , email:{' '}
        <a className="text-blue-600" href="mailto:sas.hcm@fe.edu.vn">
          sas.hcm@fe.edu.vn
        </a>
        <br />© Powered by FPT University | CMS | library | books24x7
      </div>
    </div>
  );
};

export default ThoiKhoaBieuPage;
