import { useState, useCallback, useMemo, useContext } from 'react';
import { useExams } from '@/hooks/useExams';
import { examColumns } from '@/components/common/DataTable/exam-columns';
import { DataTable } from '@/components/common/DataTable/data-table';
import TaskFilterExam from '@/components/TaskFilter/TaskFilterExam';
import { AppContext } from '@/contexts/app.context';
import ExamDialog, { type ExamDetail } from '@/components/Exam/ExamDialog';
import { Button } from '@/components/common/Button';
import { Eye, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Home, StickyNote, BookOpen, Pencil } from 'lucide-react';
import { format } from 'date-fns';
import type { Exam } from '@/types/exam';
import { getExamDetail } from '@/api/exam.api';
import { useQuery } from '@tanstack/react-query';
import { deleteExam } from '@/api/exam.api';
import { toast } from 'react-toastify';
import { useClassList } from '@/hooks/useClassList';
import { useSubjects } from '@/hooks/useSubjects';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

// Component hiển thị chi tiết lịch thi
function ExamDetailModal({
  open,
  onClose,
  examId,
}: {
  open: boolean;
  onClose: () => void;
  examId: number | null;
}) {
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery<{ data: ExamDetail } | null>({
    queryKey: ['exam-detail', examId],
    queryFn: () =>
      examId ? getExamDetail(examId) : Promise.resolve(null as { data: ExamDetail } | null),
    enabled: !!examId && open,
  });
  const data = apiData?.data ?? null;

  if (!open) return null;
  if (isLoading)
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) onClose();
        }}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogTitle>Đang tải chi tiết lịch thi</DialogTitle>
          <div>Đang tải chi tiết lịch thi...</div>
        </DialogContent>
      </Dialog>
    );
  if (isError || !data)
    return (
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) onClose();
        }}
      >
        <DialogContent className="max-w-lg w-full">
          <DialogTitle>Lỗi tải chi tiết lịch thi</DialogTitle>
          <div>Lỗi tải chi tiết lịch thi.</div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button onClick={onClose}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  const exam = data;
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <span>Chi tiết lịch thi</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen size={16} /> Môn học:
          </div>
          <div className="font-semibold">{exam.subjectName}</div>
          <div className="flex items-center gap-2 text-gray-600">Mã môn:</div>
          <div>{exam.subjectCode}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} /> Ngày thi:
          </div>
          <div>{formatDate(exam.examDate)}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={16} /> Ngày trả điểm:
          </div>
          <div>{formatDate(exam.gradeDate)}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <StickyNote size={16} /> Loại kiểm tra:
          </div>
          <div>{exam.examType}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <Home size={16} /> Phòng thi:
          </div>
          <div>{exam.room}</div>
          <div className="flex items-center gap-2 text-gray-600">
            <StickyNote size={16} /> Ghi chú:
          </div>
          <div>{exam.examNote}</div>
          <div className="flex items-center gap-2 text-gray-600">Mã học sinh:</div>
          <div>{exam.studentId}</div>
          <div className="flex items-center gap-2 text-gray-600">Người tạo:</div>
          <div>{exam.createdBy}</div>
          <div className="flex items-center gap-2 text-gray-600">Ngày tạo:</div>
          <div>{formatDate(exam.createdDate)}</div>
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

  // Thay đổi state lưu selectedExam thành examId
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  // State cho modal chung
  const [openExamDialog, setOpenExamDialog] = useState(false);
  const [examDialogMode, setExamDialogMode] = useState<'add' | 'edit'>('add');
  const [examDialogData, setExamDialogData] = useState<ExamDetail | null>(null);
  console.log('Exam data:', data);

  const { data: classListData } = useClassList();
  const classOptions = classListData?.data?.items || [];
  const { data: subjectsData } = useSubjects();
  const subjects = subjectsData || [];

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

  const { hasRole, isAdmin } = useContext(AppContext);
  const isPrincipal = isAdmin() || hasRole('Principal') || hasRole('principal');

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
      {/* Nút tạo lịch thi cho principal */}
      {isPrincipal && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => {
              setExamDialogMode('add');
              setExamDialogData(null);
              setOpenExamDialog(true);
            }}
          >
            Tạo lịch thi
          </Button>
        </div>
      )}
      <ExamDialog
        mode={examDialogMode}
        exam={examDialogData}
        open={openExamDialog}
        onClose={() => setOpenExamDialog(false)}
        onSuccess={() => refetch()}
        classOptions={classOptions}
        subjects={subjects}
      />
      <TaskFilterExam onChange={handleFilterChange} current={filters} />

      {/* Data Table with Server-side Pagination */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        {isError ? (
          <div className="text-red-600 text-center mt-4">Lỗi tải dữ liệu lịch thi.</div>
        ) : (
          <>
            <DataTable
              columns={[
                ...examColumns,
                {
                  id: 'actions',
                  header: '',
                  cell: ({ row }: { row: { original: Exam } }) => (
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                        title="Xem chi tiết"
                        onClick={() => {
                          setSelectedExamId(row.original.examId);
                          setOpenDetail(true);
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800"
                        title="Sửa lịch thi"
                        onClick={() => {
                          setExamDialogMode('edit');
                          setExamDialogData(row.original as ExamDetail);
                          setOpenExamDialog(true);
                        }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        title="Xóa lịch thi"
                        onClick={async () => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa lịch thi này?')) {
                            try {
                              await deleteExam(row.original.examId);
                              toast.success('Xóa lịch thi thành công!');
                              refetch();
                            } catch (err: unknown) {
                              const errorMsg =
                                err && typeof err === 'object' && 'message' in err
                                  ? (err as { message?: string }).message
                                  : '';
                              toast.error('Xóa lịch thi thất bại! ' + (errorMsg || ''));
                            }
                          }
                        }}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  ),
                },
              ]}
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
            <ExamDetailModal
              open={openDetail}
              onClose={() => setOpenDetail(false)}
              examId={selectedExamId}
            />
          </>
        )}
      </div>
    </div>
  );
}
