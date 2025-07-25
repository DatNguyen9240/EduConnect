import type { Notification } from '@/types/notification.type';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchNotificationsFromApi, markNotificationAsRead } from '@/api/notification.api';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';

interface NotificationApiItem {
  notificationId?: string;
  id?: string;
  title: string;
  content?: string;
  body?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  timestamp?: string;
  metaData?: Record<string, unknown>;
  data?: Record<string, unknown>;
}

interface NotificationApiResponse {
  data: NotificationApiItem[];
  success: boolean;
  message: string;
  error: null | string[];
}

// Hook chính
export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { userInfo } = useContext(AppContext);

  // Fetch notifications từ API mới, key phụ thuộc userId
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', userInfo?.id],
    queryFn: async (): Promise<{ data: Notification[] }> => {
      const res = (await fetchNotificationsFromApi(0, 20)) as NotificationApiResponse;
      // Chuẩn hóa dữ liệu về Notification[]
      return {
        data: (res.data || []).map((item: NotificationApiItem) => ({
          id: item.notificationId || item.id || '',
          title: item.title,
          body: item.content || item.body || '',
          type: (item.type as Notification['type']) || 'system',
          read: item.isRead ?? item.read ?? false,
          timestamp: item.createdAt || item.timestamp || '',
          data: (item.metaData || item.data || {}) as Record<string, string>,
        })),
      };
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    enabled: !!userInfo?.id,
    refetchInterval: 10000, // 10 giây polling notification realtime
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Các hàm mutation sẽ cần cập nhật lại nếu backend hỗ trợ
  // Hiện tại chỉ cập nhật cache để UI phản hồi nhanh

  // Đánh dấu đã đọc
  const markAsRead = async (id: string) => {
    // Gọi API đánh dấu đã đọc
    const res = await markNotificationAsRead([id]);
    if (res.success) {
      queryClient.setQueryData<{ data: Notification[] }>(
        ['notifications', userInfo?.id],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            data: oldData.data.map((n) => (n.id === id ? { ...n, read: true } : n)),
          };
        }
      );
    } else {
      toast.error('Đánh dấu đã đọc thất bại!');
    }
  };

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = () => {
    queryClient.setQueryData<{ data: Notification[] }>(
      ['notifications', userInfo?.id],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          data: oldData.data.map((n) => ({ ...n, read: true })),
        };
      }
    );
    // TODO: Gọi API cập nhật trạng thái read nếu backend hỗ trợ
  };

  // Xóa thông báo (chỉ cập nhật cache, chưa gọi API xóa)
  const deleteNotification = (id: string) => {
    queryClient.setQueryData<{ data: Notification[] }>(
      ['notifications', userInfo?.id],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          data: oldData.data.filter((n) => n.id !== id),
        };
      }
    );
    // TODO: Gọi API xóa nếu backend hỗ trợ
  };

  // Xóa tất cả thông báo (chỉ cập nhật cache)
  const clearAllNotifications = () => {
    queryClient.setQueryData(['notifications', userInfo?.id], { data: [] });
    toast.success('Đã xóa tất cả thông báo');
    // TODO: Gọi API xóa nếu backend hỗ trợ
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    // Các trạng thái mutation có thể bỏ qua vì mutation chỉ cập nhật cache
    isMarkingAsRead: false,
    isMarkingAllAsRead: false,
    isDeleting: false,
  };
};

export default useNotifications;
