import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Notification } from '@/types/notification.type';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  loading?: boolean;
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  loading = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Lấy icon dựa vào loại thông báo
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'exam':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case 'class':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'grade':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'system':
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  // Format thời gian
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    date.setHours(date.getHours() + 7); // Cộng thêm 7 tiếng cho GMT+7
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

  // Xử lý click vào thông báo
  const handleNotificationClick = (notification: Notification) => {
    setIsOpen(false);

    if (onMarkAsRead && !notification.read) {
      onMarkAsRead(notification.id);
    }

    if (notification.data) {
      // Điều hướng dựa vào loại thông báo
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

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Notification bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Thông báo</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && onMarkAllAsRead && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-xs text-white/80 hover:text-white"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Đang tải...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <BellOff className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Không có thông báo nào</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.slice(0, 5).map((notification) => (
                  <li
                    key={notification.id}
                    className={`${
                      notification.read ? 'bg-white' : 'bg-blue-50'
                    } hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`text-xs font-medium ${notification.read ? 'text-gray-900' : 'text-blue-700'}`}
                            >
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {notification.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onViewAll) {
                    onViewAll();
                  }
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-1 hover:bg-blue-50 rounded"
              >
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
