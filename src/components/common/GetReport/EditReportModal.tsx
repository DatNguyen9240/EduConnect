import React from 'react';
import type { ReportItem } from '@/api/report.api';

export interface EditReportModalProps {
  open: boolean;
  report: ReportItem | null;
  onClose: () => void;
  onSave: (data: ReportItem) => void | Promise<void>;
}

const EditReportModal: React.FC<EditReportModalProps> = ({ open, report, onClose, onSave }) => {
  const [value, setValue] = React.useState(report?.content ?? '');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setValue(report?.content ?? '');
  }, [report]);

  if (!open || !report) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({ ...report, content: value });
      onClose();
    } catch (error) {
      console.error('Failed to save report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-blue-700">Chỉnh sửa nội dung báo cáo</h2>
        <textarea
          className="w-full border rounded p-2 text-sm mb-4"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          disabled={loading}
        />
        <div className="flex gap-4 justify-end">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={handleSave}
            disabled={loading}
          >
            Lưu
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReportModal;
