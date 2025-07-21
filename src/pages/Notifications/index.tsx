import React, { useState } from 'react';
import NotificationList from '@/components/NotificationList';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Filter, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types/notification.type';

const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  // Lọc thông báo dựa vào tab đang active
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  // Xử lý khi click vào thông báo
  const handleNotificationClick = (notification: Notification) => {
    // Đánh dấu đã đọc
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Điều hướng dựa vào loại thông báo
    if (notification.data) {
      switch (notification.type) {
        case 'exam':
          if (notification.data.exam_id) {
            navigate(`/lich-thi?examId=${notification.data.exam_id}`);
          }
          break;
        case 'class':
          if (notification.data.class_id) {
            navigate(`/class/${notification.data.class_id}`);
          }
          break;
        default:
          // Mặc định không làm gì
          break;
      }
    }
  };

  // Đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Thông báo
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-red-100 text-red-800 text-xs font-medium">
              {unreadCount}
            </span>
          )}
        </h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead()}
              className="text-sm flex items-center gap-1"
            >
              <Bell className="h-4 w-4" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="unread" className="data-[state=active]:bg-white">
                Chưa đọc
              </TabsTrigger>
              <TabsTrigger value="exam" className="data-[state=active]:bg-white">
                Lịch thi
              </TabsTrigger>
              <TabsTrigger value="class" className="data-[state=active]:bg-white">
                Lớp học
              </TabsTrigger>
              <TabsTrigger value="grade" className="data-[state=active]:bg-white">
                Điểm số
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="ghost" className="p-2" title="Lọc thông báo">
                <Filter className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" className="p-2" title="Xóa tất cả">
                <Trash2 className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onNotificationClick={handleNotificationClick}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onNotificationClick={handleNotificationClick}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="exam" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onNotificationClick={handleNotificationClick}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="class" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onNotificationClick={handleNotificationClick}
              loading={isLoading}
            />
          </TabsContent>

          <TabsContent value="grade" className="mt-0">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onNotificationClick={handleNotificationClick}
              loading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
