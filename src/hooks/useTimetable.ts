/* eslint-disable */
import { useState, useEffect, useContext } from 'react';
import {
  getTimetableByClassId,
  getStudentById,
  convertTimetableSlotsToScheduleItems,
} from '@/api/timetable.api';
import type { ScheduleItem } from '@/components/common/TimeTable';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import { AppContext } from '@/contexts/app.context';

export const useTimetable = () => {
  const { selectedStudent } = useSelectedStudent();
  const { userInfo, isParent, isStudent } = useContext(AppContext);
  const [classId, setClassId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timetableInfo, setTimetableInfo] = useState<any>(null);

  // Lấy classId dựa vào vai trò người dùng
  useEffect(() => {
    const getClassId = async () => {
      setIsLoading(true);
      try {
        if (isParent()) {
          // Nếu là phụ huynh, lấy classId từ selectedStudent
          if (selectedStudent?.classId) {
            console.log('Parent - Found classId:', selectedStudent.classId);
            setClassId(selectedStudent.classId);
            setStudentName(selectedStudent.fullName);
            setClassName(selectedStudent.className);
          } else {
            console.log('Parent - No classId found in selectedStudent:', selectedStudent);
          }
        } else if (isStudent()) {
          // Nếu là học sinh, lấy classId từ thông tin học sinh
          const studentId = userInfo?.id;
          if (studentId) {
            try {
              // Lấy thông tin học sinh từ API
              console.log('Student - Fetching info with ID:', studentId);
              const response = await getStudentById(studentId);
              console.log('Student - API response:', response);

              if (response.success) {
                const student = response.data;
                console.log('Student - Data received:', student);

                if (student.classId) {
                  console.log('Student - Found classId:', student.classId);
                  setClassId(student.classId);
                  setStudentName(student.fullName);
                  setClassName(student.className);
                } else {
                  console.log('Student - No classId in student data:', student);
                }
              }
            } catch (error) {
              console.error('Lỗi khi lấy thông tin học sinh:', error);
            }
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin lớp học:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getClassId();
  }, [selectedStudent, userInfo, isParent, isStudent]);

  // Lấy thời khóa biểu khi có classId
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!classId) {
        console.log('No classId available, skipping timetable fetch');
        return;
      }

      console.log('Fetching timetable for classId:', classId);
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTimetableByClassId(classId);
        console.log('Timetable API response:', response);

        if (response.success && response.data.length > 0) {
          const timetableData = response.data[0];
          console.log('Timetable data found:', timetableData);
          setTimetableInfo(timetableData);

          const items = convertTimetableSlotsToScheduleItems(timetableData.slots);
          console.log('Converted schedule items:', items);
          setScheduleItems(items);
        } else {
          console.log('No timetable data found or API returned error');
          setScheduleItems([]);
          setTimetableInfo(null);
        }
      } catch (err) {
        console.error('Lỗi khi lấy thời khóa biểu:', err);
        setError(err instanceof Error ? err : new Error('Đã xảy ra lỗi khi tải thời khóa biểu'));
        setScheduleItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimetable();
  }, [classId]);

  return {
    scheduleItems,
    isLoading,
    error,
    refetch: () => {
      if (classId) {
        setIsLoading(true);
        getTimetableByClassId(classId)
          .then((response) => {
            if (response.success && response.data.length > 0) {
              const timetableData = response.data[0];
              setTimetableInfo(timetableData);
              const items = convertTimetableSlotsToScheduleItems(timetableData.slots);
              setScheduleItems(items);
            } else {
              setScheduleItems([]);
              setTimetableInfo(null);
            }
          })
          .catch((err) => {
            console.error('Lỗi khi lấy thời khóa biểu:', err);
            setError(
              err instanceof Error ? err : new Error('Đã xảy ra lỗi khi tải thời khóa biểu')
            );
            setScheduleItems([]);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    studentName,
    className,
    timetableInfo,
    hasData: scheduleItems.length > 0,
    isParentWithoutStudent: isParent() && !selectedStudent,
    isStudentWithoutClass: isStudent() && !classId,
  };
};
