import React, { useEffect, useState, useContext, useCallback } from 'react';
import { getReports, updateReport, deleteReport } from '@/api/report.api';
import type { ReportItem } from '@/api/report.api';
import { AppContext } from '@/contexts/app.context';
import DeleteConfirmModal from '@/components/common/GetReport/DeleteConfirmModal';
import EditReportModal from '@/components/common/GetReport/EditReportModal';
// Thêm import cho toast
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedReportsPage: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editReport, setEditReport] = useState<ReportItem | null>(null);

  const { userInfo } = useContext(AppContext);
  const accountId = userInfo?.userId || '';

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getReports({
        AccountId: accountId,
        ReportType: '',
        Status: '',
        SortBy: '',
        SortDesc: false,
        Page: 1,
        PageSize: 50,
        Search: '',
      });
      setReports(items);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi không xác định');
      }
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) fetchReports();
  }, [accountId, fetchReports]); // Giữ nguyên dependency

  // Xử lý xóa
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReport(deleteId);
      setDeleteId(null);
      fetchReports();
      toast.success('Xóa báo cáo thành công!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi khi xóa');
      }
      toast.error('Xóa báo cáo thất bại!');
    }
  };

  // Xử lý cập nhật
  const handleEditSave = async (data: ReportItem) => {
    try {
      await updateReport(data);
      setEditReport(null);
      fetchReports();
      toast.success('Cập nhật báo cáo thành công!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Lỗi khi cập nhật');
      }
      toast.error('Cập nhật báo cáo thất bại!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ToastContainer position="top-right" autoClose={2500} />
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700 text-center tracking-tight drop-shadow">
        Báo cáo đã lưu
      </h1>

      {loading && <div className="text-blue-600 animate-pulse">Đang tải...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
            <tr>
              <th className="px-4 py-3 font-bold text-left rounded-tl-xl">ID</th>
              <th className="px-4 py-3 font-bold text-left">Loại</th>
              <th className="px-4 py-3 font-bold text-left">Nội dung</th>
              <th className="px-4 py-3 font-bold text-left">Trạng thái</th>
              <th className="px-4 py-3 font-bold text-left">Người tạo</th>
              <th className="px-4 py-3 font-bold text-left">Ngày tạo</th>
              <th className="px-4 py-3 font-bold text-left rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  Không có báo cáo nào.
                </td>
              </tr>
            ) : (
              reports.map((r, idx) => (
                <tr
                  key={r.reportId}
                  className={
                    `border-b last:border-b-0 hover:bg-blue-50 transition` +
                    (idx === 0 ? ' rounded-t-xl' : '') +
                    (idx === reports.length - 1 ? ' rounded-b-xl' : '')
                  }
                >
                  <td className="px-4 py-2 font-semibold text-blue-700">{r.reportId}</td>
                  <td className="px-4 py-2">{r.reportType}</td>
                  <td
                    className="px-4 py-2 max-w-[350px] whitespace-pre-line text-gray-700"
                    title={r.content}
                  >
                    {r.content}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-bold ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-blue-600 font-medium">{r.createdBy}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(r.createdDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                      onClick={() => setEditReport(r)}
                    >
                      Sửa
                    </button>
                    <button
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                      onClick={() => setDeleteId(r.reportId)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Xác nhận xóa báo cáo"
        description="Bạn có chắc chắn muốn xóa báo cáo này không?"
      />

      {/* Modal cập nhật báo cáo */}
      <EditReportModal
        open={!!editReport}
        report={editReport}
        onClose={() => setEditReport(null)}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default SavedReportsPage;
