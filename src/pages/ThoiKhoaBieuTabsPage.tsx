import { useState } from 'react';
import ThoiKhoaBieuPage from './ThoiKhoaBieu';
// Sửa lại import cho đúng export default
import ReportingTool from '@/components/common/ReportingTool';

const ThoiKhoaBieuTabsPage = () => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'feedback'>('timetable');

  return (
    <div className="p-4 sm:p-6 md:p-10">
      {/* Tab Buttons */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 -mb-px font-medium ${
            activeTab === 'timetable'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('timetable')}
        >
          Thời khóa biểu
        </button>
        <button
          className={`ml-4 px-4 py-2 -mb-px font-medium ${
            activeTab === 'feedback'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('feedback')}
        >
          Công cụ tạo báo cáo
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'timetable' ? <ThoiKhoaBieuPage /> : <ReportingTool />}
    </div>
  );
};

export default ThoiKhoaBieuTabsPage;
