'use client';

import React, { useEffect, useState, useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Phone, Video, MoreHorizontal, Send } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatApi } from '@/api/chat.api';
import type { AxiosResponse } from 'axios';
import type { ChatHistoryResponse } from '@/api/chat.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/Dialog';
import { Label } from '@/components/common/Label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/common/Select';
import { AppContext } from '@/contexts/app.context';
import { useSelectedStudent } from '@/contexts/selected-student.context';
import api from '@/lib/axios';
import { useSimpleToast } from '@/hooks/Toast/use-simple-toast';

interface ChatItem {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isActive?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  avatar: string;
}

interface Teacher {
  teacherId: string;
  fullName: string;
  subjectId: number;
  subjectName: string;
}

interface Lesson {
  lessonId: number;
  classId: number;
  teacherId: string;
  timetableId: number;
  date: string;
  subjectId: number;
  isDeleted: boolean;
  className: string;
  teacherName: string;
  subjectName: string;
  timetableSlot: string;
}

// Hàm tách phần text markdown trước JSON
function extractContent(text: string): string {
  // Nếu có JSON phía sau, chỉ lấy phần trước dấu { đầu tiên
  const idx = text.indexOf('{');
  if (idx > 0) {
    return text.slice(0, idx).trim();
  }
  return text;
}

// Hàm chuyển đổi nội dung dạng bảng thành HTML table
function renderTableContent(content: string): React.ReactNode | null {
  // Kiểm tra xem nội dung có phải là bảng không
  if (content.includes('┌') && content.includes('└') && content.includes('│')) {
    try {
      // Tách các dòng
      const lines = content.split('\n');
      const tableRows: string[][] = [];
      let headers: string[] = [];

      // Xử lý từng dòng để trích xuất dữ liệu
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Bỏ qua các dòng ngăn cách
        if (
          line.includes('┌') ||
          line.includes('└') ||
          line.includes('├') ||
          line.includes('─') ||
          line.includes('┬') ||
          line.includes('┼')
        ) {
          continue;
        }

        // Xử lý dòng chứa dữ liệu
        if (line.includes('│')) {
          const cells = line
            .split('│')
            .filter((cell) => cell.trim() !== '')
            .map((cell) => cell.trim());

          if (headers.length === 0 && cells.length > 0) {
            headers = cells;
          } else if (cells.length > 0) {
            tableRows.push(cells);
          }
        }
      }

      // Nếu không tìm thấy dữ liệu hợp lệ
      if (headers.length === 0 || tableRows.length === 0) {
        return null;
      }

      // Xử lý các emoji và trạng thái đặc biệt
      const processCell = (cell: string) => {
        // Xử lý trạng thái đặc biệt
        if (cell.includes('✅')) {
          return (
            <span className="flex items-center">
              <span className="text-green-500 mr-1">✅</span>
              <span>{cell.replace('✅', '')}</span>
            </span>
          );
        } else if (cell.includes('⚠️')) {
          return (
            <span className="flex items-center">
              <span className="text-yellow-500 mr-1">⚠️</span>
              <span>{cell.replace('⚠️', '')}</span>
            </span>
          );
        }
        return cell;
      };

      // Tạo HTML table
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-blue-50">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-300 px-3 py-2 text-xs font-semibold text-blue-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-xs">
                      {processCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (error) {
      console.error('Lỗi khi chuyển đổi bảng:', error);
      return null;
    }
  }

  return null;
}

// Định nghĩa type cho dữ liệu bảng điểm
interface StudentGrade {
  SubjectName: string;
  Semester: string;
  Scores: Array<{
    GradeType: string;
    Score: number;
    Evaluation?: string | null;
  }>;
  AverageScore: number;
}
interface StudentInfo {
  StudentId: string;
  StudentName: string;
  DateOfBirth?: string;
  ClassName?: string;
}
interface Student {
  StudentInfo: StudentInfo;
  Grades: StudentGrade[];
  AttendanceRecords?: AttendanceRecord[];
}
interface GradeData {
  Students: Student[];
}
// Điểm danh
interface AttendanceRecord {
  SubjectName: string;
  DayOfWeek: string;
  StartTime: string;
  EndTime: string;
  Status: string;
  Room: string;
}
interface AttendanceData {
  Students: Array<{
    AttendanceRecords: AttendanceRecord[];
  }>;
}
// Báo cáo
interface StudentNote {
  StudentId: string;
  StudentName: string;
  NoteType: string;
  Points: number | null;
  Description: string;
  CreatedAt: string;
}
interface ReportInfo {
  ReportId: number;
  LessonDate: string;
  SubjectName: string;
  ClassName: string;
  TotalStudents: number;
  AbsentStudents: number;
  Remarks: string;
  CreatedAt: string;
}
interface Report {
  ReportInfo: ReportInfo;
  StudentNotes: StudentNote[];
}
interface ReportData {
  Reports: Report[];
}

function extractJsonFromBotReply(reply: string): Record<string, unknown> | null {
  const jsonStart = reply.indexOf('{');
  if (jsonStart === -1) return null;
  try {
    const jsonString = reply.slice(jsonStart).trim();
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

const StudentGradeTable = ({ data }: { data: GradeData }) => {
  if (!data || !data.Students || !data.Students[0]) return null;
  const grades = data.Students[0].Grades;
  return (
    <table className="w-full border-collapse text-left my-4">
      <thead>
        <tr className="bg-blue-50">
          <th className="border border-gray-300 px-2 py-1">MÔN HỌC</th>
          <th className="border border-gray-300 px-2 py-1">HỌC KỲ</th>
          <th className="border border-gray-300 px-2 py-1">LOẠI ĐIỂM</th>
          <th className="border border-gray-300 px-2 py-1">ĐIỂM SỐ</th>
          <th className="border border-gray-300 px-2 py-1">ĐÁNH GIÁ</th>
        </tr>
      </thead>
      <tbody>
        {grades.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center text-gray-500 py-4">
              Không có dữ liệu điểm cho học sinh này
            </td>
          </tr>
        ) : (
          grades.map((g: StudentGrade, i: number) => (
            <React.Fragment key={i}>
              <tr className="bg-blue-50 font-semibold text-blue-900">
                <td className="border border-gray-300 px-2 py-1">{g.SubjectName}</td>
                <td className="border border-gray-300 px-2 py-1">{g.Semester}</td>
                <td className="border border-gray-300 px-2 py-1">TB môn</td>
                <td className="border border-gray-300 px-2 py-1">
                  {Number(g.AverageScore).toFixed(2)}
                </td>
                <td className="border border-gray-300 px-2 py-1"></td>
              </tr>
              {g.Scores.map((s: StudentGrade['Scores'][number], j: number) => (
                <tr key={j} className="bg-white text-gray-700">
                  <td className="border border-gray-300 px-2 py-1 pl-6 text-gray-500">
                    <span className="mr-1">↳</span>
                  </td>
                  <td className="border border-gray-300 px-2 py-1"></td>
                  <td className="border border-gray-300 px-2 py-1">{s.GradeType}</td>
                  <td className="border border-gray-300 px-2 py-1">{s.Score}</td>
                  <td className="border border-gray-300 px-2 py-1">{s.Evaluation || ''}</td>
                </tr>
              ))}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );
};

const AttendanceTable = ({ data }: { data: AttendanceData }) => {
  if (!data || !data.Students || !data.Students[0]) return null;
  const records = data.Students[0].AttendanceRecords;
  return (
    <table className="w-full border-collapse text-left my-4">
      <thead>
        <tr className="bg-blue-50">
          <th className="border px-2 py-1">Môn học</th>
          <th className="border px-2 py-1">Thứ</th>
          <th className="border px-2 py-1">Thời gian</th>
          <th className="border px-2 py-1">Trạng thái</th>
          <th className="border px-2 py-1">Phòng</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r: AttendanceRecord, i: number) => (
          <tr key={i}>
            <td className="border px-2 py-1">{r.SubjectName}</td>
            <td className="border px-2 py-1">{r.DayOfWeek}</td>
            <td className="border px-2 py-1">
              {r.StartTime}-{r.EndTime}
            </td>
            <td className="border px-2 py-1">{r.Status}</td>
            <td className="border px-2 py-1">{r.Room}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ReportTable = ({ data }: { data: ReportData }) => {
  if (!data || !data.Reports) return <div>Không có báo cáo nào.</div>;
  if (data.Reports.length === 0) return <div>Không có báo cáo nào.</div>;
  return (
    <table className="w-full border-collapse text-left my-4">
      <thead>
        <tr className="bg-blue-50">
          <th className="border px-2 py-1">Ngày học</th>
          <th className="border px-2 py-1">Môn học</th>
          <th className="border px-2 py-1">Lớp</th>
          <th className="border px-2 py-1">Sĩ số</th>
          <th className="border px-2 py-1">Vắng</th>
          <th className="border px-2 py-1">Nhận xét</th>
          <th className="border px-2 py-1">Ngày tạo</th>
        </tr>
      </thead>
      <tbody>
        {data.Reports.map((report: Report, i: number) => (
          <React.Fragment key={i}>
            <tr className="bg-blue-50 font-semibold text-blue-900">
              <td className="border px-2 py-1">{report.ReportInfo.LessonDate}</td>
              <td className="border px-2 py-1">{report.ReportInfo.SubjectName}</td>
              <td className="border px-2 py-1">{report.ReportInfo.ClassName}</td>
              <td className="border px-2 py-1">{report.ReportInfo.TotalStudents}</td>
              <td className="border px-2 py-1">{report.ReportInfo.AbsentStudents}</td>
              <td className="border px-2 py-1">{report.ReportInfo.Remarks}</td>
              <td className="border px-2 py-1">{report.ReportInfo.CreatedAt}</td>
            </tr>
            {report.StudentNotes && report.StudentNotes.length > 0 && (
              <tr>
                <td colSpan={7} className="p-0">
                  <table className="w-full border-collapse text-left bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Mã HS</th>
                        <th className="border px-2 py-1">Tên học sinh</th>
                        <th className="border px-2 py-1">Loại ghi chú</th>
                        <th className="border px-2 py-1">Điểm</th>
                        <th className="border px-2 py-1">Mô tả</th>
                        <th className="border px-2 py-1">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.StudentNotes.map((note: StudentNote, j: number) => (
                        <tr key={j}>
                          <td className="border px-2 py-1">{note.StudentId}</td>
                          <td className="border px-2 py-1">{note.StudentName}</td>
                          <td className="border px-2 py-1">{note.NoteType}</td>
                          <td className="border px-2 py-1">
                            {note.Points !== null ? note.Points : '-'}
                          </td>
                          <td className="border px-2 py-1">{note.Description}</td>
                          <td className="border px-2 py-1">{note.CreatedAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

function isGradeData(obj: unknown): obj is GradeData {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'Students' in obj &&
    Array.isArray((obj as { [key: string]: unknown }).Students)
  ) {
    const students = (obj as { [key: string]: unknown }).Students as unknown[];
    return students.length > 0 && (students[0] as { [key: string]: unknown }).Grades !== undefined;
  }
  return false;
}
function isAttendanceData(obj: unknown): obj is AttendanceData {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'Students' in obj &&
    Array.isArray((obj as { [key: string]: unknown }).Students)
  ) {
    const students = (obj as { [key: string]: unknown }).Students as unknown[];
    return (
      students.length > 0 &&
      (students[0] as { [key: string]: unknown }).AttendanceRecords !== undefined
    );
  }
  return false;
}
function isReportData(obj: unknown): obj is ReportData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'Reports' in obj &&
    Array.isArray((obj as { [key: string]: unknown }).Reports)
  );
}

function renderBotDataTable(jsonData: unknown) {
  if (!jsonData) return null;
  if (isGradeData(jsonData)) {
    return <StudentGradeTable data={jsonData} />;
  }
  if (isAttendanceData(jsonData)) {
    return <AttendanceTable data={jsonData} />;
  }
  if (isReportData(jsonData)) {
    return <ReportTable data={jsonData} />;
  }
  return null;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  // Cập nhật kiểu của feedbackType
  const [feedbackType, setFeedbackType] = useState<
    'principal' | 'teacher' | 'grade' | 'report' | 'attendance'
  >('principal');
  // Thay đổi state dateRange thành startDate và endDate
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Mặc định là 7 ngày sau startDate
    return date.toISOString().split('T')[0];
  });
  const [feedbackContent, setFeedbackContent] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  // const [teacherLessons, setTeacherLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  // const [loadingTeachers, setLoadingTeachers] = useState(false);
  // const [loadingLessons, setLoadingLessons] = useState(false);

  const { userInfo, hasRole } = useContext(AppContext);
  const { selectedStudent } = useSelectedStudent();
  const toast = useSimpleToast();

  const isStudent = () => hasRole('Student');
  const isParent = () => hasRole('Parent');

  // Đưa fetchHistory ra ngoài để có thể gọi lại
  const fetchHistory = async () => {
    try {
      const res = await chatApi.fetchChatHistory();
      console.log('lưu lịch sử: ', res.data.messages);
      const history = res.data?.messages || [];
      if (history.length) {
        setMessages(
          history.map((msg: ChatHistoryResponse['data']['messages'][number], idx: number) => ({
            id: idx + '-' + msg.role,
            sender: msg.role,
            // Nếu là bot thì giữ nguyên content, nếu là user thì extractContent
            content: msg.role === 'bot' ? msg.message : extractContent(msg.message),
            timestamp: new Date(msg.timestamp).toLocaleTimeString(),
            isOwn: msg.role === 'user',
            avatar: msg.role === 'user' ? '/assets/avatar/default.jpg' : '/assets/avatar/bot.png',
          }))
        );
      }
    } catch (err) {
      console.error('Lỗi lấy lịch sử chat:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (showFeedbackModal) {
      fetchTeachers();
    }
  }, [showFeedbackModal]);

  useEffect(() => {
    if (selectedTeacher && feedbackType === 'teacher') {
      fetchTeacherLessons(selectedTeacher);
    }
  }, [selectedTeacher, feedbackType]);

  const fetchTeachers = async () => {
    // setLoadingTeachers(true);
    try {
      const response = await api.get<{
        success: boolean;
        data: Teacher[];
        message: string;
      }>('/api/v1/teachers');
      if (response.success && Array.isArray(response.data)) {
        setTeachers(response.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      // setLoadingTeachers(false);
    }
  };

  const fetchTeacherLessons = async (teacherId: string) => {
    if (!teacherId) return;
    try {
      const response = await api.get<{
        success: boolean;
        data: {
          items: Lesson[];
          totalCount: number;
          pageIndex: number;
          pageSize: number;
          totalPages: number;
        };
        message: string;
      }>(`/api/v1/teachers/${teacherId}/lessons`);
      if (response.success && response.data && Array.isArray(response.data.items)) {
        if (response.data.items.length > 0) {
          setSelectedLesson(response.data.items[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching teacher lessons:', error);
    }
  };

  // Cập nhật hàm handleFeedbackSubmit để xử lý các loại mới
  const handleFeedbackSubmit = async () => {
    if (!feedbackContent.trim()) {
      toast.toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung phản hồi',
        variant: 'destructive',
      });
      return;
    }

    // Tổng hợp message từ các trường
    let message = '';
    if (feedbackType === 'principal') {
      message = `[PHẢN HỒI NHÀ TRƯỜNG]\n`;
    } else if (feedbackType === 'teacher') {
      message = `[PHẢN HỒI GIÁO VIÊN]\n`;
    } else if (feedbackType === 'grade') {
      message = `[YÊU CẦU XEM ĐIỂM SỐ]\n`;
      message += `Thời gian: Từ ${startDate} đến ${endDate}\n`;
    } else if (feedbackType === 'report') {
      message = `[YÊU CẦU BÁO CÁO BUỔI HỌC]\n`;
      message += `Thời gian: Từ ${startDate} đến ${endDate}\n`;
    } else if (feedbackType === 'attendance') {
      message = `[YÊU CẦU XEM TÌNH HÌNH ĐIỂM DANH]\n`;
      message += `Thời gian: Từ ${startDate} đến ${endDate}\n`;
    }
    if (isParent() && selectedStudent) {
      message += `Tên phụ huynh: ${userInfo?.fullName}\n`;
      message += `Mã phụ huynh: ${userInfo?.id}\n`;
      message += `Tên học sinh: ${selectedStudent.fullName}\n`;
      message += `Mã học sinh: ${selectedStudent.studentId}\n`;
      message += `Lớp: ${selectedStudent.className}\n`;
    }
    if (isStudent() && userInfo) {
      message += `Tên học sinh: ${userInfo.fullName}\n`;
      message += `Mã học sinh: ${userInfo.id}\n`;
      message += `Lớp: ${(userInfo as { className?: string }).className || ''}\n`;
    }
    if (feedbackType === 'teacher' && selectedLesson) {
      message += `Giáo viên: ${selectedLesson.teacherName}\n`;
      message += `Môn học: ${selectedLesson.subjectName}\n`;
    }
    message += `Nội dung: ${feedbackContent}`;

    try {
      await chatApi.chatWithBot(message);
      toast.toast({
        title: 'Thành công',
        description: 'Gửi phản hồi thành công',
        variant: 'success',
      });
      setShowFeedbackModal(false);
      setFeedbackContent('');
      setFeedbackType('principal');
      setSelectedTeacher('');
      setSelectedLesson(null);
      // Gọi lại fetchHistory để cập nhật đoạn chat
      fetchHistory();
      setMessage(''); // reset ô input chat về rỗng
    } catch {
      toast.toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi gửi phản hồi',
        variant: 'destructive',
      });
    }
  };

  const openFeedbackModal = () => {
    setShowFeedbackModal(true);
    setFeedbackContent('');
    setFeedbackType('principal');
    setSelectedTeacher('');
    setSelectedLesson(null);
  };

  // Hàm gửi message
  const handleSend = async () => {
    if (!message.trim()) return;

    // Kiểm tra nếu tin nhắn có ý định gửi feedback
    if (
      /(feedback|ý kiến|góp ý|khiếu nại|tình hình học tập|điểm|sổ liên lạc|điểm danh)/i.test(
        message
      )
    ) {
      openFeedbackModal();
      return;
    }

    const userMsg: Message = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      isOwn: true,
      avatar: '/assets/avatar/default.jpg',
    };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);
    try {
      const res = (await chatApi.chatWithBot(message)) as AxiosResponse<{
        role: string;
        message: string;
      }>;
      if (res.data?.message) {
        console.log('Bot trả lời:', res.data.message);
        const botMsg: Message = {
          id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + '-bot',
          sender: 'bot',
          content: res.data.message, // Giữ nguyên content bot trả về
          timestamp: new Date().toLocaleTimeString(),
          isOwn: false,
          avatar: '/assets/avatar/bot.png',
        };
        setMessages((prev) => {
          const all = [...prev, botMsg];
          return all;
        });
      }
    } catch (err) {
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi thông tin chat bot cho đồng bộ giao diện
  const botName = 'EduConnect Bot';
  const botRole = 'AI Chatbot';
  const botAvatar = '/assets/avatar/bot.png';

  const chats: ChatItem[] = [
    {
      id: 'bot',
      name: botName,
      role: botRole,
      lastMessage: '',
      timestamp: '',
      avatar: botAvatar,
      isActive: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 border-t border-gray-200">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={botAvatar} />
              <AvatarFallback>Bot</AvatarFallback>
            </Avatar>
            <div className="w-3 h-3 bg-green-500 rounded-full absolute ml-7 mt-7 border-2 border-white"></div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {/* Chats Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Chats</h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    chat.isActive ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar || '/placeholder.svg'} />
                    <AvatarFallback>
                      {chat.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium truncate ${chat.isActive ? 'text-white' : 'text-gray-900'}`}
                      >
                        {chat.name}
                      </p>
                      <span
                        className={`text-xs ${chat.isActive ? 'text-indigo-200' : 'text-gray-500'}`}
                      >
                        {chat.timestamp}
                      </span>
                    </div>
                    <p
                      className={`text-xs truncate ${chat.isActive ? 'text-indigo-200' : 'text-gray-500'}`}
                    >
                      {chat.role}
                    </p>
                    {chat.lastMessage && (
                      <p
                        className={`text-xs truncate mt-1 ${chat.isActive ? 'text-indigo-100' : 'text-gray-600'}`}
                      >
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={botAvatar} />
                <AvatarFallback>Bot</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-medium text-gray-900">{botName}</h2>
                <p className="text-xs text-gray-500">{botRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto h-full">
          <div className="space-y-4 ">
            {loading && <div className="text-xs text-gray-400">Bot đang trả lời...</div>}
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              let jsonData: Record<string, unknown> | null = null;
              if (isBot) {
                jsonData = extractJsonFromBotReply(msg.content);
              }
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar || '/placeholder.svg'} />
                      <AvatarFallback>Bot</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? 'order-first' : ''}`}>
                    {isBot && jsonData ? (
                      <div className="bg-white rounded-lg shadow-md overflow-hidden my-2 border border-blue-200">
                        <div className="bg-blue-50 px-3 py-2 border-b border-blue-200">
                          <h3 className="text-sm font-medium text-blue-700">DỮ LIỆU CHI TIẾT</h3>
                        </div>
                        {renderBotDataTable(jsonData)}
                      </div>
                    ) : renderTableContent(msg.content) ? (
                      <div className="bg-white rounded-lg shadow-md overflow-hidden my-2 border border-blue-200">
                        <div className="bg-blue-50 px-3 py-2 border-b border-blue-200">
                          <h3 className="text-sm font-medium text-blue-700">Thông tin bảng</h3>
                        </div>
                        {renderTableContent(msg.content)}
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-2xl w-fit ${
                          msg.isOwn ? 'bg-gray-100 text-gray-900' : 'bg-indigo-500 text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    )}
                    {msg.timestamp && (
                      <div
                        className={`flex items-center gap-1 mt-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <span className="text-xs text-gray-500">{msg.timestamp}</span>
                        {msg.isOwn && (
                          <div className="w-4 h-4 text-green-500">
                            <svg viewBox="0 0 16 16" fill="currentColor">
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {msg.isOwn && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar || '/placeholder.svg'} />
                      <AvatarFallback>FR</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 items-center ">
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pr-20 bg-gray-50 border-gray-200"
              />
            </div>
            <div>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={handleSend}
                disabled={loading}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={(open) => setShowFeedbackModal(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi phản hồi</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="feedback-type">Loại phản hồi</Label>
              <Select
                value={feedbackType}
                onValueChange={(value) =>
                  setFeedbackType(
                    value as 'principal' | 'teacher' | 'grade' | 'report' | 'attendance'
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại phản hồi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Ý kiến về cơ sở nhà trường</SelectItem>
                  <SelectItem value="teacher">Ý kiến về giảng dạy giáo viên</SelectItem>
                  <SelectItem value="grade">Điểm số</SelectItem>
                  <SelectItem value="report">Báo cáo buổi học</SelectItem>
                  <SelectItem value="attendance">Tình hình điểm danh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isStudent() && userInfo && (
              <>
                <div>
                  <Label htmlFor="student-name">Tên học sinh</Label>
                  <Input id="student-name" value={userInfo.fullName || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="student-id">Mã học sinh</Label>
                  <Input id="student-id" value={userInfo.id || ''} disabled />
                </div>
                {/* Lớp có thể không có trong userInfo */}
                <div>
                  <Label htmlFor="class-name">Lớp</Label>
                  <Input
                    id="class-name"
                    value={(userInfo as { className?: string }).className || ''}
                    disabled
                  />
                </div>
              </>
            )}

            {isParent() && selectedStudent && (
              <>
                <div>
                  <Label htmlFor="parent-name">Tên phụ huynh</Label>
                  <Input id="parent-name" value={userInfo?.fullName || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="parent-id">Mã phụ huynh</Label>
                  <Input id="parent-id" value={userInfo?.id || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="student-name">Tên học sinh</Label>
                  <Input id="student-name" value={selectedStudent.fullName || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="student-id">Mã học sinh</Label>
                  <Input id="student-id" value={selectedStudent.studentId || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="class-name">Lớp</Label>
                  <Input id="class-name" value={selectedStudent.className || ''} disabled />
                </div>
              </>
            )}

            {feedbackType === 'teacher' && (
              <>
                <div>
                  <Label htmlFor="teacher-id">Giáo viên</Label>
                  <Select
                    value={selectedTeacher}
                    onValueChange={(value) => setSelectedTeacher(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn giáo viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                          {teacher.fullName} - {teacher.teacherId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTeacher && selectedLesson && (
                  <>
                    <div>
                      <Label htmlFor="subject-name">Môn học</Label>
                      <Input id="subject-name" value={selectedLesson.subjectName || ''} disabled />
                    </div>
                    {/* Ẩn các trường không cần thiết */}
                  </>
                )}
              </>
            )}

            {(feedbackType === 'grade' ||
              feedbackType === 'report' ||
              feedbackType === 'attendance') && (
              <>
                <div>
                  <Label htmlFor="start-date">Từ ngày</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Đến ngày</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                    min={startDate} // Không cho chọn ngày kết thúc trước ngày bắt đầu
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="feedback-content">Nội dung phản hồi</Label>
              <textarea
                id="feedback-content"
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                placeholder="Nhập nội dung phản hồi của bạn..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleFeedbackSubmit}>
                Gửi phản hồi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
