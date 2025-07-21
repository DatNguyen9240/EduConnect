import type { ScheduleItem } from '@/components/common/TimeTable';
import axios from 'axios';
import { timetableData } from '@/data/timetableData';

const API_BASE_URL = 'https://educonnectswd-buh0fbdfabcqfehm.australiaeast-01.azurewebsites.net';

export interface TimetableSlot {
  timetableSlotId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  period: number;
  room: string;
  subjectName: string;
  teacherName: string;
}

export interface Timetable {
  timetableId: number;
  name: string;
  startDate: string;
  endDate: string;
  slots: TimetableSlot[];
}

export interface TimetableResponse {
  success: boolean;
  message: string;
  data: Timetable[];
  error: null | string[];
}

export interface StudentData {
  studentId: string;
  accountId: string;
  classId: string;
  fullName: string;
  email: string;
  className: string;
  parentName: string;
  // Các trường khác có thể có
}

export interface StudentResponse {
  success: boolean;
  message: string;
  data: StudentData;
  error: null | string[];
}

// Lấy thời khóa biểu theo lớp
export const getTimetableByClassId = async (
  classId: number | string,
  startDate?: string,
  endDate?: string
): Promise<TimetableResponse> => {
  try {
    // Nếu không có startDate và endDate, sử dụng ngày hiện tại và ngày sau 7 ngày
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const formattedStartDate = startDate || today.toISOString().split('T')[0];
    const formattedEndDate = endDate || nextWeek.toISOString().split('T')[0];

    const url = `${API_BASE_URL}/api/v1/timetables?classId=${classId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    console.log(`Calling API: ${url}`);

    const response = await axios.get(url);
    console.log('Raw API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching timetable:', error);
    return {
      success: false,
      message: 'Failed to fetch timetable',
      data: [],
      error: ['API request failed'],
    };
  }
};

// Lấy thông tin học sinh theo ID
export const getStudentById = async (studentId: string): Promise<StudentResponse> => {
  try {
    console.log(`Calling API: ${API_BASE_URL}/api/v1/students/${studentId}`);
    const response = await axios.get(`${API_BASE_URL}/api/v1/students/${studentId}`);
    console.log('Raw student API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    return {
      success: false,
      message: 'Failed to fetch student',
      data: {
        studentId: '',
        accountId: '',
        classId: '',
        fullName: '',
        email: '',
        className: '',
        parentName: '',
      },
      error: ['API request failed'],
    };
  }
};

// Tìm kiếm thông tin bổ sung từ dữ liệu tĩnh
const findStaticItemInfo = (day: string, period: number): Partial<ScheduleItem> | null => {
  const staticItem = timetableData.find((item) => item.day === day && item.period === period);
  if (staticItem) {
    return {
      status: staticItem.status,
      location: staticItem.location,
      roomNote: staticItem.roomNote,
    };
  }
  return null;
};

// Chuyển đổi dữ liệu từ API sang định dạng hiển thị
export const convertTimetableSlotsToScheduleItems = (
  timetableSlots: TimetableSlot[]
): ScheduleItem[] => {
  console.log('Converting timetable slots:', timetableSlots);

  if (!timetableSlots || !Array.isArray(timetableSlots)) {
    console.error('Invalid timetable slots data:', timetableSlots);
    return [];
  }

  const dayMapping: { [key: string]: string } = {
    'Thứ Hai': 'Thứ 2',
    'Thứ Ba': 'Thứ 3',
    'Thứ Tư': 'Thứ 4',
    'Thứ Năm': 'Thứ 5',
    'Thứ Sáu': 'Thứ 6',
    'Thứ Bảy': 'Thứ 7',
    'Chủ Nhật': 'Chủ nhật',
    // Thêm các ánh xạ tiếng Anh
    Monday: 'Thứ 2',
    Tuesday: 'Thứ 3',
    Wednesday: 'Thứ 4',
    Thursday: 'Thứ 5',
    Friday: 'Thứ 6',
    Saturday: 'Thứ 7',
    Sunday: 'Chủ nhật',
  };

  return timetableSlots.map((slot) => {
    // Xử lý trường hợp dữ liệu không đúng định dạng
    const dayOfWeek = slot.dayOfWeek || '';
    const mappedDay = dayMapping[dayOfWeek] || dayOfWeek;
    console.log(`Mapping day: ${dayOfWeek} -> ${mappedDay}`);

    // Chuyển đổi thời gian từ định dạng "HH:mm:ss" sang "HH:mm"
    const formatTime = (time: string) => {
      if (!time) return '';
      try {
        return time.substring(0, 5);
      } catch (e) {
        console.error('Error formatting time:', e);
        return time;
      }
    };

    const startTime = formatTime(slot.startTime || '');
    const endTime = formatTime(slot.endTime || '');
    const timeString = startTime && endTime ? `${startTime} - ${endTime}` : '';

    // Tìm thông tin bổ sung từ dữ liệu tĩnh
    const staticInfo = findStaticItemInfo(mappedDay, slot.period);

    // Tạo item với dữ liệu từ API và bổ sung từ dữ liệu tĩnh
    const item: ScheduleItem = {
      subject: slot.subjectName || 'Không có tên môn học',
      teacher: slot.teacherName || 'Không có tên giáo viên',
      day: mappedDay,
      period: slot.period || 0,
      room: slot.room || '',
      // Sử dụng dữ liệu tĩnh nếu có, nếu không sử dụng giá trị mặc định
      location: staticInfo?.location || slot.room || 'NVH',
      roomNote: staticInfo?.roomNote || `Phòng ${slot.room || 'chưa cập nhật'}`,
      time: timeString,
      status: staticInfo?.status,
    };

    console.log('Converted item:', item);
    return item;
  });
};
