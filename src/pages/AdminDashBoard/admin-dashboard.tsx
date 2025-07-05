'use client';

import { Badge } from '@/components/common/Badge';
import { EducationStats } from './education-stats';
import { CourseProgress } from './course-progress';
import { GradeChart } from './grade-chart';
import { UpcomingAssignments } from './upcoming-assignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentPerformance } from './student-performance';

export default function AdminDashboard() {
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
          </div>
        </main>
      </div>
    </div>
  );
}
