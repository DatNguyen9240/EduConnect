import { useState } from 'react';
import ThoiKhoaBieuPage from './ThoiKhoaBieu';
import ReportingTool from '@/components/common/ReportTool';
import SavedReportsPage from '../components/common/GetReport';

const ThoiKhoaBieuTabsPage = () => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'feedback' | 'savedReports'>(
    'timetable'
  );

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
        <button
          className={`ml-4 px-4 py-2 -mb-px font-medium ${
            activeTab === 'savedReports'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('savedReports')}
        >
          Báo cáo đã lưu
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'timetable' && <ThoiKhoaBieuPage />}
      {activeTab === 'feedback' && <ReportingTool />}
      {activeTab === 'savedReports' && <SavedReportsPage />}
    </div>
  );
};

export default ThoiKhoaBieuTabsPage;
