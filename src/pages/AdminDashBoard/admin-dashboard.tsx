'use client';

import { Badge } from '@/components/common/Badge';
import { EducationStats } from './education-stats';
import { CourseProgress } from './course-progress';
import { GradeChart } from './grade-chart';
import { UpcomingAssignments } from './upcoming-assignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentPerformance } from './student-performance';
import { useFeedbacks } from '@/hooks/useFeedbacks';
import TeacherList from './teacher-list';
import { useState } from 'react';

export default function AdminDashboard() {
  // State phân trang phản hồi phụ huynh
  const [parentPageIndex, setParentPageIndex] = useState(0);
  const [parentPageSize] = useState(10);

  // Lấy feedbacks cho card phụ huynh
  const {
    data: feedbackData,
    isLoading: feedbackLoading,
    error: feedbackError,
  } = useFeedbacks({
    pageIndex: parentPageIndex,
    pageSize: parentPageSize,
    sortBy: 'DateTime',
    ascending: false,
  });
  // Hàm xử lý phân trang
  const handleParentNextPage = () => {
    if (feedbackData?.totalPages && parentPageIndex < feedbackData.totalPages - 1) {
      setParentPageIndex(parentPageIndex + 1);
    }
  };
  const handleParentPrevPage = () => {
    if (parentPageIndex > 0) {
      setParentPageIndex(parentPageIndex - 1);
    }
  };

  // Tính tổng số trang dựa vào API response
  const totalPages = feedbackData?.totalPages || 1;
  const currentPage = (feedbackData?.pageIndex ?? parentPageIndex) + 1;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Giáo dục</h1>
                <p className="text-gray-600">Chào mừng bạn đến với hệ thống quản lý học tập</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Học kỳ I - 2023/2024
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <EducationStats />

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Course Progress */}
              <div className="lg:col-span-1">
                <CourseProgress />
              </div>

              {/* Grade Chart */}
              <div className="lg:col-span-2">
                <GradeChart />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Upcoming Assignments */}
              <UpcomingAssignments />

              {/* Quick Actions & Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Bài kiểm tra Toán 12A1 đã được tạo</p>
                        <p className="text-xs text-gray-500">5 phút trước</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">32 học sinh đã nộp bài tập Vật lý</p>
                        <p className="text-xs text-gray-500">15 phút trước</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Lịch học tuần tới đã được cập nhật</p>
                        <p className="text-xs text-gray-500">30 phút trước</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Học sinh mới Trần Văn F đã đăng ký</p>
                        <p className="text-xs text-gray-500">1 giờ trước</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nhắc nhở: Hạn nộp bài tập Hóa học</p>
                        <p className="text-xs text-gray-500">2 giờ trước</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Student Performance Table */}
            <StudentPerformance />

            {/* Feedback Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Feedback Section */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-indigo-700">
                    Phản hồi từ phụ huynh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {feedbackLoading ? (
                    <div>Đang tải phản hồi...</div>
                  ) : feedbackError ? (
                    <div className="text-red-500">Lỗi khi tải phản hồi</div>
                  ) : (
                    <div className="space-y-4">
                      {feedbackData?.data && feedbackData.data.length > 0 ? (
                        feedbackData.data.map((fb) => (
                          <div key={fb.feedbackId} className="border-b pb-2 mb-2">
                            <div className="font-semibold text-blue-700">{fb.parentName}</div>
                            <div className="text-gray-800 mb-1">{fb.content}</div>
                            <div className="text-xs text-gray-500">
                              {fb.createdAt
                                ? new Date(fb.createdAt).toLocaleString('vi-VN')
                                : 'Không có thông tin thời gian'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">Không có phản hồi nào.</div>
                      )}
                      {/* Phân trang */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          onClick={handleParentPrevPage}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'}`}
                        >
                          Trang trước
                        </button>
                        <span>
                          Trang {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={handleParentNextPage}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'}`}
                        >
                          Trang sau
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teacher List Section */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-indigo-700">
                    Danh sách giáo viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeacherList />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
