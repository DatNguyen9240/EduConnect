import React, { useState } from 'react';
import 'animate.css'; // Make sure to import Animate.css

export interface GradeItem {
  subject: string;
  oral: number;
  shortTest: number;
  midterm: number;
  final: number;
  average?: number;
}

const initialData: GradeItem[] = [
  { subject: 'Toán', oral: 8, shortTest: 7, midterm: 7, final: 8 },
  { subject: 'Văn', oral: 6, shortTest: 6, midterm: 6.5, final: 6.5 },
  { subject: 'Lý', oral: 8, shortTest: 7, midterm: 8, final: 7.5 },
  { subject: 'Hóa', oral: 7.5, shortTest: 7, midterm: 7.5, final: 8 },
  { subject: 'Anh Văn', oral: 7, shortTest: 6.5, midterm: 6.5, final: 7 },
];

const GradeTable: React.FC = () => {
  const [grades, setGrades] = useState<GradeItem[]>(initialData);

  // Tính điểm trung bình với tỷ lệ phần trăm
  const calculateAverage = (oral: number, shortTest: number, midterm: number, final: number) => {
    const oralWeight = 0.1; // 10%
    const shortTestWeight = 0.15; // 15%
    const midtermWeight = 0.25; // 25%
    const finalWeight = 0.5; // 50%

    return (
      oral * oralWeight +
      shortTest * shortTestWeight +
      midterm * midtermWeight +
      final * finalWeight
    ).toFixed(2); // Chuyển về dạng số với 2 chữ số thập phân
  };

  const updateGrades = () => {
    const updatedGrades = grades.map((item) => ({
      ...item,
      average: parseFloat(calculateAverage(item.oral, item.shortTest, item.midterm, item.final)),
    }));
    setGrades(updatedGrades);
  };

  // Tính điểm trung bình cộng
  const calculateClassAverage = () => {
    const totalAverage = grades.reduce((acc, grade) => acc + (grade.average || 0), 0);
    return (totalAverage / grades.length).toFixed(2); // Trung bình cộng tất cả môn
  };

  // Phân loại học sinh
  const classifyStudent = (average: number) => {
    if (average < 6.5) return 'Học sinh trung bình';
    if (average >= 6.5 && average < 8) return 'Học sinh khá';
    if (average >= 8 && average < 9) return 'Học sinh giỏi';
    return 'Học sinh xuất sắc';
  };

  const classAverage = calculateClassAverage();
  const classification = classifyStudent(parseFloat(classAverage));

  return (
    <div className="container mx-auto p-6">
      {/* Title with fade-in animation */}
      <h2 className="text-2xl font-bold mb-4 animate__animated animate__fadeIn">
        Bảng Điểm Học Sinh
      </h2>

      {/* Table with smooth transitions */}
      <table className="min-w-full table-auto border-collapse transition-all duration-300 ease-in-out">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="border px-4 py-2">Môn Học</th>
            <th className="border px-4 py-2">Điểm Miệng </th>
            <th className="border px-4 py-2">Kiểm Tra 15 Phút </th>
            <th className="border px-4 py-2">Điểm Giữa Kỳ </th>
            <th className="border px-4 py-2">Điểm Cuối Kỳ </th>
            <th className="border px-4 py-2">Điểm Trung Bình</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-100 transition-all duration-200 ease-in-out"
            >
              <td className="border px-4 py-2">{grade.subject}</td>
              <td className="border px-4 py-2">{grade.oral}</td>
              <td className="border px-4 py-2">{grade.shortTest}</td>
              <td className="border px-4 py-2">{grade.midterm}</td>
              <td className="border px-4 py-2">{grade.final}</td>
              <td className="border px-4 py-2">{grade.average || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Displaying class average and student classification with a fade-in animation */}
      <div className="mt-6 animate__animated animate__fadeIn">
        <p className="text-lg font-semibold">Điểm Trung Bình Cộng: {classAverage}</p>
        <p className="text-lg font-semibold">Phân Loại: {classification}</p>
      </div>

      {/* Update button with hover effect */}
      <button
        onClick={updateGrades}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-blue-700"
      >
        Cập Nhật Điểm Trung Bình
      </button>
    </div>
  );
};

export default GradeTable;
