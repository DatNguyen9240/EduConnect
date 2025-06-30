import { useState, useCallback, useMemo, useContext } from 'react';
import { useExams } from '@/hooks/useExams';
import { examColumns } from '@/components/common/DataTable/exam-columns';
import { DataTable } from '@/components/common/DataTable/data-table';
import TaskFilterExam from '@/components/TaskFilter/TaskFilterExam';
import { AppContext } from '@/contexts/app.context';

export default function LichThi() {
  // Lấy thông tin từ AppContext (không cần destructure gì nếu không dùng)
  useContext(AppContext);

  // Default date range: từ đầu năm đến cuối năm hiện tại
  const currentYear = new Date().getFullYear();
  const defaultStartDate = `${currentYear}-01-01`;
  const defaultEndDate = `${currentYear}-12-31`;

  // State cho filter
  const [filters, setFilters] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    studentId: undefined as string | undefined,
    searchTerm: '',
    sortBy: 'examDate',
    ascending: true,
  });

  // State cho phân trang
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  // Memoize the combined params to prevent unnecessary re-renders
  const queryParams = useMemo(
    () => ({
      ...filters,
      ...pagination,
    }),
    [filters, pagination]
  );

  // Gọi API với React Query
  const { data, isLoading, isError, refetch } = useExams(queryParams);

  // Xử lý khi đổi filter - memoize để tránh infinite loop
  const handleFilterChange = useCallback(
    (newFilter: Record<string, unknown>) => {
      setFilters({
        ...filters,
        ...newFilter,
      });
      setPagination({ ...pagination, pageIndex: 1 }); // reset về trang 1 khi đổi filter
    },
    [filters, pagination]
  );

  // Xử lý khi đổi trang
  const handlePageChange = useCallback(
    (page: number) => {
      setPagination({ ...pagination, pageIndex: page });
    },
    [pagination]
  );

  // Xử lý khi đổi page size
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      setPagination({ ...pagination, pageIndex: 1, pageSize });
    },
    [pagination]
  );

  // Xử lý search từ DataTable
  const handleSearchChange = useCallback(
    (searchValue: string) => {
      setFilters({
        ...filters,
        searchTerm: searchValue,
      });
      setPagination({ ...pagination, pageIndex: 1 }); // reset về trang 1 khi search
    },
    [filters, pagination]
  );

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Exams</h2>
          <p className="text-red-700 mb-4">Không thể tải dữ liệu lịch thi. Vui lòng thử lại.</p>
          <button
            onClick={() => refetch()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskFilterExam onChange={handleFilterChange} current={filters} />

      {/* Data Table with Server-side Pagination */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <DataTable
          columns={examColumns}
          data={data?.data || []}
          // Server-side pagination props
          pageIndex={data?.pageIndex || 1}
          pageSize={data?.pageSize || 10}
          totalCount={data?.totalCount || 0}
          totalPages={data?.totalPages || 1}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // Search props
          searchValue={filters.searchTerm}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Tìm kiếm theo tên môn, ghi chú..."
          // Loading state
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
