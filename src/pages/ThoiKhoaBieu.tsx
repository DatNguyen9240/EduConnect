import { useState, useEffect } from 'react';
import TimeTable from '@/components/common/TimeTable';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { AppContext } from '@/contexts/app.context';
import { useContext } from 'react';
import { useTimetable } from '@/hooks/useTimetable';

const ThoiKhoaBieuPage = () => {
  const { selectedStudent } = useSelectedStudent();
  const { isParent } = useContext(AppContext);
  
  // State cho việc chọn tuần
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [availableWeeks, setAvailableWeeks] = useState<{ start: Date; end: Date; label: string }[]>(
    []
  );

  // Hàm lấy ngày đầu tuần (thứ 2) từ một ngày bất kỳ
  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    // Trong JavaScript, 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
    const diff = day === 0 ? -6 : 1 - day; // Nếu là chủ nhật thì lùi 6 ngày, còn không thì lùi (day - 1) ngày
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  };

  // Hàm lấy ngày cuối tuần (chủ nhật) từ ngày đầu tuần
  const getEndOfWeek = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return endDate;
  };

  // Hàm format ngày tháng
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Hàm tạo nhãn cho tuần
  const createWeekLabel = (startDate: Date, endDate: Date): string => {
    return `Tuần ${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
  };

  // Khởi tạo danh sách các tuần
  useEffect(() => {
    const today = new Date();
    const currentWeekStart = getStartOfWeek(today);

    // Tạo danh sách 5 tuần: 2 tuần trước, tuần hiện tại, 2 tuần sau
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

  // Lấy ngày đầu tuần và cuối tuần từ selectedWeek
  const startDate = selectedWeek
    ? getStartOfWeek(selectedWeek).toISOString().split('T')[0]
    : undefined;
  const endDate = selectedWeek
    ? getEndOfWeek(getStartOfWeek(selectedWeek)).toISOString().split('T')[0]
    : undefined;

  // Sử dụng hook useTimetable với React Query
  const { scheduleItems, isLoading, error, studentName, className } = useTimetable(
    startDate,
    endDate
  );

  // Xử lý khi thay đổi tuần
  const handleWeekChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value, 10);
    const selectedWeekData = availableWeeks[selectedIndex];
    setSelectedWeek(selectedWeekData.start);
  };

  // Hiển thị thông báo khi chưa chọn học sinh (đối với phụ huynh)
  if (isParent() && !selectedStudent) {
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

  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Tiêu đề */}
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
        {studentName ? `Thời khóa biểu của ${studentName}` : 'Thời khóa biểu'}
        {className && ` - Lớp ${className}`}
      </h2>

      {/* Chọn tuần */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-md">
          <label htmlFor="week-select" className="block text-sm font-medium text-gray-700 mb-1">
            Chọn tuần:
          </label>
          <select
            id="week-select"
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            onChange={handleWeekChange}
            value={availableWeeks.findIndex(
              (week) => week.start.toDateString() === selectedWeek.toDateString()
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

      {/* Ghi chú đầu trang */}
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

      {/* Hiển thị trạng thái loading */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6 text-center">
          {error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải thời khóa biểu'}
        </div>
      )}

      {/* TimeTable */}
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
                  <span className="font-medium">{formatDate(selectedWeek)}</span> đến{' '}
                  <span className="font-medium">{formatDate(getEndOfWeek(selectedWeek))}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chú thích trạng thái */}
      <div className="mt-6 text-sm text-gray-700 px-4 sm:px-0">
        <p>
          <strong className="text-green-600">(attended)</strong>: {studentName || 'Học sinh'} đã
          tham gia hoạt động này
        </p>
        <p>
          <strong className="text-red-500">(absent)</strong>: {studentName || 'Học sinh'} không tham
          gia hoạt động này
        </p>
        <p>
          <strong>(Not yet)</strong>: hoạt động chưa diễn ra
        </p>
        <p>
          <strong>(-)</strong>: không có dữ liệu
        </p>
      </div>

      {/* Footer liên hệ */}
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
