// Định nghĩa các kiểu dữ liệu cho bảng
interface SubjectInfo {
  SubjectId: number;
  SubjectName: string;
  SlotId: number;
}

interface ClassInfo {
  ClassId: number;
  ClassName: string;
  StudentCount: number;
  Subjects: SubjectInfo[];
}

interface StudentInfo {
  Student: {
    StudentId: string;
    FullName: string;
    Email: string;
    DateOfBirth: string;
    Gender: string;
  };
  Grades: GradeInfo[];
}

interface GradeInfo {
  SubjectId: number;
  Score: number;
  GradeType: string;
  Semester: string;
}

interface StatisticsInfo {
  TotalGrades: number;
  AverageGrade: number;
  HighestGrade: number;
  LowestGrade: number;
  ExcellentCount: number;
  GoodCount: number;
  AverageCount: number;
  BelowAverageCount: number;
  SubjectBreakdown: Array<{
    SubjectId: number;
    AverageGrade: number;
    StudentCount: number;
  }>;
}
import React, { useState } from 'react';

export interface BotChatCardProps {
  messages: string[];
  onSaveReport: (msg: string) => void;
  onSendChat: (
    chatText: string,
    setLoading: (v: boolean) => void,
    setInput: (v: string) => void
  ) => void;
}

const BotChatCard: React.FC<BotChatCardProps> = ({ messages, onSaveReport, onSendChat }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Hiển thị bảng cho các JSON đặc biệt, còn lại giữ khung code
  function renderTableForClasses(classes: ClassInfo[]) {
    return (
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-xs my-2 border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-900">
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Tên lớp</th>
              <th className="px-2 py-1">Sĩ số</th>
              <th className="px-2 py-1">Môn học</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.ClassId} className="border-t">
                <td className="px-2 py-1">{c.ClassId}</td>
                <td className="px-2 py-1">{c.ClassName}</td>
                <td className="px-2 py-1">{c.StudentCount}</td>
                <td className="px-2 py-1">
                  {c.Subjects?.map((s) => `${s.SubjectName} (${s.SlotId})`).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderTableForStudents(students: StudentInfo[]) {
    return (
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-xs my-2 border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-green-100 text-green-900">
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">Tên</th>
              <th className="px-2 py-1">Email</th>
              <th className="px-2 py-1">Ngày sinh</th>
              <th className="px-2 py-1">Giới tính</th>
              <th className="px-2 py-1">Số điểm</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-2 py-1">{s.Student?.StudentId}</td>
                <td className="px-2 py-1">{s.Student?.FullName}</td>
                <td className="px-2 py-1">{s.Student?.Email}</td>
                <td className="px-2 py-1">{s.Student?.DateOfBirth}</td>
                <td className="px-2 py-1">{s.Student?.Gender}</td>
                <td className="px-2 py-1">{s.Grades?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderTableForStatistics(stat: StatisticsInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-2 my-2 text-xs">
        <div>
          <b>Tổng số điểm:</b> {stat.TotalGrades}
        </div>
        <div>
          <b>Điểm TB:</b> {stat.AverageGrade}
        </div>
        <div>
          <b>Cao nhất:</b> {stat.HighestGrade}
        </div>
        <div>
          <b>Thấp nhất:</b> {stat.LowestGrade}
        </div>
        <div>
          <b>Giỏi:</b> {stat.ExcellentCount} | <b>Khá:</b> {stat.GoodCount} | <b>TB:</b>{' '}
          {stat.AverageCount} | <b>Yếu:</b> {stat.BelowAverageCount}
        </div>
        <div className="mt-2">
          <b>Phân tích theo môn:</b>
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-xs mt-1 border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-yellow-100 text-yellow-900">
                <tr>
                  <th className="px-2 py-1">Môn</th>
                  <th className="px-2 py-1">Điểm TB</th>
                  <th className="px-2 py-1">Số HS</th>
                </tr>
              </thead>
              <tbody>
                {stat.SubjectBreakdown?.map((s, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-2 py-1">{s.SubjectId}</td>
                    <td className="px-2 py-1">{s.AverageGrade}</td>
                    <td className="px-2 py-1">{s.StudentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderMessageLines(lines: string[]) {
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
      if (lines[i].trim().startsWith('{')) {
        // Tìm vị trí '}' cuối cùng
        let jsonEnd = i;
        let openBraces = 0;
        for (let j = i; j < lines.length; j++) {
          const line = lines[j];
          openBraces += (line.match(/{/g) || []).length;
          openBraces -= (line.match(/}/g) || []).length;
          if (openBraces === 0) {
            jsonEnd = j;
            break;
          }
        }
        const jsonStr = lines.slice(i, jsonEnd + 1).join('\n');
        try {
          const obj = JSON.parse(jsonStr);
          // Hiển thị bảng nếu có trường đặc biệt
          if (obj.classes) {
            elements.push(renderTableForClasses(obj.classes));
          } else if (obj.students) {
            elements.push(renderTableForStudents(obj.students));
          } else if (obj.statistics) {
            elements.push(renderTableForStatistics(obj.statistics));
          } else {
            elements.push(
              <pre
                key={i}
                className="bg-gray-900 text-green-200 text-xs rounded-lg p-2 my-2 overflow-x-auto border border-gray-300"
              >
                {JSON.stringify(obj, null, 2)}
              </pre>
            );
          }
        } catch {
          elements.push(
            <div key={i} className="text-red-600 text-xs">
              {jsonStr}
            </div>
          );
        }
        i = jsonEnd + 1;
      } else {
        elements.push(<div key={i}>{lines[i]}</div>);
        i++;
      }
    }
    return elements;
  }

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-md flex flex-col gap-5 w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 scroll-smooth">
        {messages.map((msg, idx) => {
          const isBot = msg.startsWith('Bot:');
          const isUser = msg.startsWith('Bạn:');
          const isPrompt = idx === 0;

          const cleanedMsg = msg.replace(/^Bot:|^Bạn:/, '').trim();
          const messageLines = cleanedMsg.split('\n');

          const baseBubble =
            'px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap shadow max-w-[75%] break-words';
          let bubbleClass = baseBubble;
          let rowClass = 'flex items-end';
          let avatar = null;
          let bubbleAlign = 'items-end';

          if (isPrompt) {
            bubbleClass +=
              ' bg-gray-100 text-gray-800 font-semibold border border-gray-300 text-center mx-auto';
            rowClass = 'flex justify-center';
          } else if (isBot) {
            bubbleClass += ' bg-blue-100 text-blue-900 border border-blue-300';
            rowClass += ' justify-start';
            avatar = (
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-2">
                🤖
              </div>
            );
            bubbleAlign = 'items-start';
          } else if (isUser) {
            bubbleClass += ' bg-green-200 text-gray-800 border border-green-300';
            rowClass += ' justify-end';
            avatar = (
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-semibold ml-2">
                🧑
              </div>
            );
            bubbleAlign = 'items-end';
          }

          return (
            <div key={idx} className={rowClass}>
              {!isUser && avatar}
              <div className={`flex flex-col gap-1 ${bubbleAlign}`}>
                <div className={bubbleClass}>{renderMessageLines(messageLines)}</div>
                {!isPrompt && (
                  <button
                    className={`text-xs px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition self-${isUser ? 'end' : 'start'}`}
                    onClick={() => onSaveReport(msg)}
                  >
                    💾 Lưu báo cáo
                  </button>
                )}
              </div>
              {isUser && avatar}
            </div>
          );
        })}
      </div>

      <form
        className="flex gap-3 items-center mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSendChat(input, setLoading, setInput);
        }}
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhắn tiếp với AI về phản hồi này..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 font-semibold transition disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Đang gửi...' : 'Gửi'}
        </button>
      </form>
    </div>
  );
};

export default BotChatCard;
