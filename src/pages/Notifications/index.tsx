import React, { useState } from 'react';
import NotificationList from '@/components/NotificationList';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/common/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Filter, Trash2, Info, X } from 'lucide-react';
import type { Notification } from '@/types/notification.type';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/common/Dialog';

const NotificationsPage: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Lọc thông báo dựa vào tab đang active
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  // Xử lý khi click vào thông báo
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setModalOpen(true);
  };

  // Đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format thời gian đẹp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', { hour12: false });
  };

  // Hiển thị nội dung notification, hỗ trợ markdown cơ bản (in đậm, xuống dòng)
  const renderContent = (notification: Notification & { content?: string }) => {
    const body =
      notification.content && notification.content.trim().length > 0
        ? notification.content
        : notification.body;
    if (!body) return null;
    const html = body
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
      .replace(/\r/g, '');
    return (
      <div
        className="prose prose-sm max-w-none text-gray-800 bg-gray-50 rounded p-3 border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  // Render chi tiết notification
  const renderNotificationDetail = () => {
    if (!selectedNotification) return null;
    const { title, type, timestamp } = selectedNotification;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-6 w-6 text-blue-500" />
          <span className="text-lg font-bold text-blue-700">Chi tiết thông báo</span>
        </div>
        <div>
          <div className="text-xl font-semibold text-gray-900 mb-1">{title}</div>
          <div className="text-sm text-gray-500 mb-2">
            Loại: <span className="capitalize font-medium text-blue-600">{type}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">Thời gian: {formatTime(timestamp)}</div>
          {renderContent(selectedNotification)}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Thông báo chi tiết</DialogTitle>
            <DialogDescription>
              Xem chi tiết nội dung và thông tin liên quan đến thông báo.
            </DialogDescription>
          </DialogHeader>
          {renderNotificationDetail()}
          <DialogFooter>
            {!selectedNotification?.read && (
              <Button
                variant="primary"
                onClick={() => {
                  if (selectedNotification) markAsRead(selectedNotification.id);
                  setModalOpen(false);
                }}
              >
                Đánh dấu đã đọc
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">
                <X className="h-4 w-4 mr-1" /> Đóng
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
