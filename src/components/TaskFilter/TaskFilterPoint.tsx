import { useState } from 'react';
import { FilterGroup, type FilterOption } from './FilterGroup';

export default function TaskFilter() {
  const [semester, setSemester] = useState('all');
  const [grade, setGrade] = useState('4');

  const semesterOptions: FilterOption[] = [
    { label: 'Chọn học kì', value: 'all' },
    { label: 'Học kì 1', value: '1' },
    { label: 'Học kì 2', value: '2' },
  ];

  const gradeOptions: FilterOption[] = [
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
  ];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Điểm Số</h2>
      <div className="bg-white shadow-md border border-blue-100 rounded-xl p-6 flex flex-wrap gap-6 items-center">
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
              label: 'Khối',
              value: grade,
              options: gradeOptions,
              onChange: setGrade,
              minWidth: '80px',
            },
          ]}
        />
      </div>
    </div>
  );
}
