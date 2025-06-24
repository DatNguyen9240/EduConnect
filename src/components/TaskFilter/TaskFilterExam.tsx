import { useState } from 'react';
import { FilterGroup, type FilterOption } from './FilterGroup';

export default function TaskFilterExam() {
  const [semester, setSemester] = useState('all');
  const [subject, setSubject] = useState('all');
  const [exam, setExam] = useState('all');
  const [release, setRelease] = useState('all');
  const [status, setStatus] = useState('all');

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
  const examOptions: FilterOption[] = [
    { label: 'Chọn ngày thi', value: 'all' },
    { label: 'Ngày thi gần nhất', value: '1' },
    { label: 'Ngày thi xa nhất', value: '2' },
  ];
  const releaseOptions: FilterOption[] = [
    { label: 'Chọn ngày trả điểm', value: 'all' },
    { label: 'Ngày trả điểm gần nhất', value: '1' },
    { label: 'Ngày trả điểm xa nhất', value: '2' },
  ];
  const statusOptions: FilterOption[] = [
    { label: 'Chọn trạng thái', value: 'all' },
    { label: 'Đã hoàn thành', value: '1' },
    { label: 'Đang chờ', value: '2' },
    { label: 'Đã hủy', value: '3' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Điểm Số</h2>
      <div className="bg-white shadow-md border border-blue-100 rounded-xl p-6 flex flex-wrap items-center">
        <FilterGroup
          filters={[
            {
              label: 'Học Kì',
              value: semester,
              placeholder: 'Chọn học kì',
              options: semesterOptions,
              onChange: setSemester,
              minWidth: '150px',
            },
            {
              label: 'Môn học',
              value: subject,
              options: subjectOptions,
              onChange: setSubject,
              minWidth: '80px',
            },
            {
              label: 'Ngày thi',
              value: exam,
              options: examOptions,
              onChange: setExam,
              minWidth: '150px',
            },
            {
              label: 'Ngày trả điểm',
              value: release,
              options: releaseOptions,
              onChange: setRelease,
              minWidth: '170px',
            },
            {
              label: 'Trạng thái',
              value: status,
              options: statusOptions,
              onChange: setStatus,
              minWidth: '130px',
            },
          ]}
        />
      </div>
    </div>
  );
}
