import React from 'react';
import type { UserInfo } from '@/contexts/app.context';

interface ReportModalProps {
  showReportModal: boolean;
  reportContent: string | null;
  setReportContent: (v: string | null) => void;
  accountId: string | number | undefined;
  userInfo: UserInfo | null;
  saveReport: (
    accountId: string,
    reportType: string,
    content: string,
    status: string,
    createdBy: string
  ) => Promise<void>;
  setShowReportModal: (v: boolean) => void;
  toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
}

const ReportModal: React.FC<ReportModalProps> = ({
  showReportModal,
  reportContent,
  setReportContent,
  accountId,
  userInfo,
  saveReport,
  setShowReportModal,
  toast,
}) => {
  if (!showReportModal) return null;
  return (
    <div className="fixed left-0 top-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-[95vw] flex flex-col items-center">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-blue-100 rounded-full p-3 mb-2">
            <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#3b82f6" />
              <path d="M12 8v4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-blue-700 mb-1">Xác nhận lưu báo cáo</h3>
          <p className="text-gray-600 text-center text-base">
            Bạn có chắc muốn lưu báo cáo này? Bạn có thể chỉnh sửa nội dung trước khi lưu.
          </p>
        </div>
        <textarea
          className="w-full border border-blue-200 rounded-lg px-4 py-3 mb-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={reportContent || ''}
          onChange={(e) => setReportContent(e.target.value)}
          rows={6}
          placeholder="Nội dung báo cáo..."
        />
        <div className="flex gap-4 justify-end w-full mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow transition-all duration-150"
            onClick={async () => {
              try {
                await saveReport(
                  String(accountId || ''),
                  'lesson',
                  reportContent || '',
                  'active',
                  String(userInfo?.id || 'unknown')
                );
                setShowReportModal(false);
                setReportContent(null);
                toast.success('Lưu báo cáo thành công!');
              } catch {
                toast.error('Lưu báo cáo thất bại!');
                setShowReportModal(false);
              }
            }}
          >
            <span className="inline-block align-middle mr-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#fff" />
                <path d="M12 8v4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16h.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            Xác nhận lưu
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold px-6 py-2 rounded-lg shadow transition-all duration-150"
            onClick={() => {
              setShowReportModal(false);
              setReportContent(null);
            }}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
