import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getTimetableByClassId,
  getStudentById,
  convertTimetableSlotsToScheduleItems,
  getTeacherTimetable,
  getAttendanceByStudentId,
} from '@/api/timetable.api';
import type { TimetableSlot } from '@/api/timetable.api';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { AppContext } from '@/contexts/app.context';

export const useTimetable = (startDate?: string, endDate?: string) => {
  const { selectedStudent } = useSelectedStudent();
  const { userInfo, isParent, isStudent, isTeacher } = useContext(AppContext);

  // Query để lấy thông tin học sinh (nếu người dùng là học sinh)
  const studentQuery = useQuery({
    queryKey: ['student', userInfo?.id],
    queryFn: async () => {
      if (!userInfo?.id || !isStudent()) return null;
      const response = await getStudentById(userInfo.id);
      if (response.success) {
        return response.data;
      }
      throw new Error('Không thể lấy thông tin học sinh');
    },
    enabled: !!userInfo?.id && isStudent(),
  });

  // Xác định classId dựa vào vai trò người dùng
  const classId = isParent() ? selectedStudent?.classId : studentQuery.data?.classId;

  // Query để lấy thời khóa biểu cho học sinh/phụ huynh
  const studentTimetableQuery = useQuery({
    queryKey: ['student-timetable', classId, startDate, endDate],
    queryFn: async () => {
      if (!classId) throw new Error('Không có mã lớp');

      // Lấy thời khóa biểu
      const response = await getTimetableByClassId(classId, startDate, endDate);
      // Lấy attendance nếu là học sinh hoặc phụ huynh
      let attendanceList: { timetableSlotID: number; status: number }[] = [];
      if (isStudent() && userInfo?.id) {
        const attRes = await getAttendanceByStudentId(userInfo.id);
        if (attRes.success && Array.isArray(attRes.data)) attendanceList = attRes.data;
      } else if (isParent() && selectedStudent?.studentId) {
        const attRes = await getAttendanceByStudentId(selectedStudent.studentId);
        if (attRes.success && Array.isArray(attRes.data)) attendanceList = attRes.data;
      }

      if (response.success) {
        let timetableData;
        if (Array.isArray(response.data)) {
          if (response.data.length > 0) {
            timetableData = response.data[0];
          } else {
            return {
              timetableInfo: null,
              scheduleItems: [],
            };
          }
        } else {
          timetableData = response.data;
        }

        const items = convertTimetableSlotsToScheduleItems(
          timetableData.slots || [],
          attendanceList
        );
        return {
          timetableInfo: timetableData,
          scheduleItems: items,
        };
      }

      return {
        timetableInfo: null,
        scheduleItems: [],
      };
    },
    enabled: !!classId && (isStudent() || isParent()),
  });

  // Query để lấy thời khóa biểu cho giáo viên
  const teacherTimetableQuery = useQuery({
    queryKey: ['teacher-timetable', userInfo?.id, startDate, endDate],
    queryFn: async () => {
      if (!userInfo?.id || !isTeacher()) {
        throw new Error('Không có quyền truy cập thời khóa biểu giáo viên');
      }

      const response = await getTeacherTimetable(userInfo.id, startDate, endDate);

      if (response.success) {
        const timetableData = response.data;
        let slots: TimetableSlot[] = [];

        // Kiểm tra nếu data là mảng hoặc object đơn
        if (Array.isArray(timetableData)) {
          if (timetableData.length > 0) {
            slots = timetableData[0].slots || [];
          }
        } else {
          slots = timetableData.slots || [];
        }

        const items = convertTimetableSlotsToScheduleItems(slots);

        return {
          timetableInfo: Array.isArray(timetableData) ? timetableData[0] : timetableData,
          scheduleItems: items,
        };
      }

      return {
        timetableInfo: null,
        scheduleItems: [],
      };
    },
    enabled: !!userInfo?.id && isTeacher(),
  });

  // Lấy kết quả dựa trên vai trò người dùng
  const timetableQuery = isTeacher() ? teacherTimetableQuery : studentTimetableQuery;

  // Xác định tên học sinh và tên lớp
  const studentName = isParent() ? selectedStudent?.fullName : studentQuery.data?.fullName || '';
  const className = isParent() ? selectedStudent?.className : studentQuery.data?.className || '';
  const teacherName = isTeacher() ? userInfo?.fullName || '' : '';

  return {
    scheduleItems: timetableQuery.data?.scheduleItems || [],
    isLoading: studentQuery.isLoading || timetableQuery.isLoading,
    error: timetableQuery.error || studentQuery.error,
    refetch: () => {
      if ((classId && (isStudent() || isParent())) || (userInfo?.id && isTeacher())) {
        timetableQuery.refetch();
      }
    },
    studentName,
    className,
    teacherName,
    timetableInfo: timetableQuery.data?.timetableInfo,
    hasData: (timetableQuery.data?.scheduleItems?.length || 0) > 0,
    isParentWithoutStudent: isParent() && !selectedStudent,
    isStudentWithoutClass: isStudent() && !classId,
  };
};
