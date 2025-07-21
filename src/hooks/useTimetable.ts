/* eslint-disable */
import { useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTimetableByClassId,
  getStudentById,
  convertTimetableSlotsToScheduleItems,
} from '@/api/timetable.api';
import type { ScheduleItem } from '@/components/common/TimeTable';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { AppContext } from '@/contexts/app.context';

export const useTimetable = (startDate?: string, endDate?: string) => {
  const { selectedStudent } = useSelectedStudent();
  const { userInfo, isParent, isStudent } = useContext(AppContext);
  const queryClient = useQueryClient();

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

  // Query để lấy thời khóa biểu
  const timetableQuery = useQuery({
    queryKey: ['timetable', classId, startDate, endDate],
    queryFn: async () => {
      if (!classId) throw new Error('Không có mã lớp');

      const response = await getTimetableByClassId(classId, startDate, endDate);

      if (response.success && response.data.length > 0) {
        const timetableData = response.data[0];
        const items = convertTimetableSlotsToScheduleItems(timetableData.slots);
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
    enabled: !!classId,
  });

  // Xác định tên học sinh và tên lớp
  const studentName = isParent() ? selectedStudent?.fullName : studentQuery.data?.fullName || '';

  const className = isParent() ? selectedStudent?.className : studentQuery.data?.className || '';

  return {
    scheduleItems: timetableQuery.data?.scheduleItems || [],
    isLoading: studentQuery.isLoading || timetableQuery.isLoading,
    error: timetableQuery.error || studentQuery.error,
    refetch: () => {
      if (classId) {
        timetableQuery.refetch();
      }
    },
    studentName,
    className,
    timetableInfo: timetableQuery.data?.timetableInfo,
    hasData: (timetableQuery.data?.scheduleItems?.length || 0) > 0,
    isParentWithoutStudent: isParent() && !selectedStudent,
    isStudentWithoutClass: isStudent() && !classId,
  };
};
