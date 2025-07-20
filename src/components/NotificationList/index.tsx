import React, { useState } from 'react';
import { Bell, Calendar, BookOpen, Users, X, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { Notification } from '@/types/notification.type';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
  loading?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  className = '',
  loading = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Lấy icon dựa vào loại thông báo
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'exam':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'class':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'grade':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'system':
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format thời gian
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Thông báo
        </h2>
        {onMarkAllAsRead && notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={onMarkAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[500px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-3 text-gray-500">Đang tải thông báo...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-gray-700 font-medium">Không có thông báo nào</h3>
            <p className="text-gray-500 text-sm mt-1">
              Bạn sẽ nhận được thông báo về các hoạt động quan trọng tại đây
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`relative ${
                  notification.read ? 'bg-white' : 'bg-blue-50'
                } hover:bg-gray-50 transition-colors`}
                onMouseEnter={() => setHoveredId(notification.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="px-6 py-4 cursor-pointer flex gap-4"
                  onClick={() => onNotificationClick && onNotificationClick(notification)}
                >
                  {/* Icon */}
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-700'}`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.body}</p>
                  </div>

                  {/* Action icon */}
                  <div className="flex-shrink-0 self-center">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Actions */}
                {(onMarkAsRead || onDelete) && hoveredId === notification.id && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!notification.read && onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        title="Đánh dấu đã đọc"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        title="Xóa thông báo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
