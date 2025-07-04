import { useSelectedStudent } from '@/contexts/selected-student.context';
import { Button } from '../common/Button';
import { useState } from 'react';
import ParentProfileSelector from './ParentProfileSelector';

export default function SelectedStudentInfo() {
  const { selectedStudent } = useSelectedStudent();
  const [showSelector, setShowSelector] = useState(false);

  if (showSelector) {
    return (
      <ParentProfileSelector
        onSelect={() => setShowSelector(false)}
        onClose={() => setShowSelector(false)}
      />
    );
  }

  if (!selectedStudent) return null;

  return (
    <div className="flex items-center w-full gap-3">
      <img
        src={selectedStudent.avatarUrl || '/placeholder.svg?height=50&width=50'}
        alt={selectedStudent.fullName}
        width={50}
        height={50}
        className="rounded-full object-cover border-2 border-blue-600"
        style={{
          width: 50,
          height: 50,
          minWidth: 50,
          minHeight: 50,
          objectFit: 'cover',
          borderRadius: '50%',
        }}
      />
      <div className="overflow-hidden transition-all duration-300 w-full">
        <div className="min-w-[120px] opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 w-full flex flex-col items-start">
          <span className="font-medium text-gray-800 leading-tight mt-1">
            {selectedStudent.fullName}
          </span>
          <span className="text-xs text-gray-500 leading-tight">{selectedStudent.className}</span>
          <Button
            className="mt-2 px-2 py-1 text-xs rounded"
            style={{ minWidth: 0, height: 28 }}
            onClick={() => setShowSelector(true)}
          >
            Chọn con khác
          </Button>
        </div>
      </div>
    </div>
  );
}
