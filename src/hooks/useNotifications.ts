import type { Notification } from '@/types/notification.type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Hàm lưu thông báo vào localStorage
const saveNotificationsToLocalStorage = (notifications: Notification[]) => {
  try {
    localStorage.setItem('educonnect_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
};

// Hàm lấy thông báo từ localStorage
const getNotificationsFromLocalStorage = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem('educonnect_notifications');
    if (storedNotifications) {
      return JSON.parse(storedNotifications);
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
  return [];
};

// Các API calls
const fetchNotifications = async (): Promise<{ data: Notification[] }> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // const response = await api.get<{ data: Notification[] }>('/api/v1/notifications');

  // Trước khi trả về dữ liệu từ API, kết hợp với dữ liệu từ localStorage
  // Nếu API trả về dữ liệu, chúng ta sẽ cập nhật localStorage
  // return response;

  // Tạm thời, chỉ trả về dữ liệu từ localStorage
  const localNotifications = getNotificationsFromLocalStorage();
  return { data: localNotifications };
};

const markAsRead = async (id: string): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // await api.put(`/api/v1/notifications/${id}/read`);

  // Cập nhật localStorage
  const notifications = getNotificationsFromLocalStorage();
  const updatedNotifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  saveNotificationsToLocalStorage(updatedNotifications);

  return Promise.resolve();
};

const markAllAsRead = async (): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // await api.put('/api/v1/notifications/read-all');

  // Cập nhật localStorage
  const notifications = getNotificationsFromLocalStorage();
  const updatedNotifications = notifications.map((n) => ({ ...n, read: true }));
  saveNotificationsToLocalStorage(updatedNotifications);

  return Promise.resolve();
};

const deleteNotification = async (id: string): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // await api.delete(`/api/v1/notifications/${id}`);

  // Cập nhật localStorage
  const notifications = getNotificationsFromLocalStorage();
  const updatedNotifications = notifications.filter((n) => n.id !== id);
  saveNotificationsToLocalStorage(updatedNotifications);

  return Promise.resolve();
};

// Hook chính
export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  const notifications = data?.data || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Thêm thông báo mới
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Cập nhật cache
    queryClient.setQueryData<{ data: Notification[] }>(['notifications'], (oldData) => {
      const currentData = oldData || { data: [] };
      const newData = {
        ...currentData,
        data: [newNotification, ...(currentData.data || [])],
      };

      // Lưu vào localStorage
      saveNotificationsToLocalStorage(newData.data);

      return newData;
    });
  };

  // Mutation để đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<{ data: Notification[] }>(['notifications']);

      if (previousData) {
        const updatedData = {
          data: previousData.data.map((n) => (n.id === id ? { ...n, read: true } : n)),
        };
        queryClient.setQueryData(['notifications'], updatedData);

        // Lưu vào localStorage
        saveNotificationsToLocalStorage(updatedData.data);
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // Rollback nếu có lỗi
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
      toast.error('Không thể đánh dấu đã đọc');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation để đánh dấu tất cả đã đọc
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<{ data: Notification[] }>(['notifications']);

      if (previousData) {
        const updatedData = {
          data: previousData.data.map((n) => ({ ...n, read: true })),
        };
        queryClient.setQueryData(['notifications'], updatedData);

        // Lưu vào localStorage
        saveNotificationsToLocalStorage(updatedData.data);
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // Rollback nếu có lỗi
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
      toast.error('Không thể đánh dấu tất cả đã đọc');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation để xóa thông báo
  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<{ data: Notification[] }>(['notifications']);

      if (previousData) {
        const updatedData = {
          data: previousData.data.filter((n) => n.id !== id),
        };
        queryClient.setQueryData(['notifications'], updatedData);

        // Lưu vào localStorage
        saveNotificationsToLocalStorage(updatedData.data);
      }

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      // Rollback nếu có lỗi
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
      toast.error('Không thể xóa thông báo');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Xóa tất cả thông báo
  const clearAllNotifications = () => {
    // Cập nhật cache
    queryClient.setQueryData(['notifications'], { data: [] });

    // Xóa khỏi localStorage
    saveNotificationsToLocalStorage([]);

    toast.success('Đã xóa tất cả thông báo');
  };

  // Xử lý đánh dấu đã đọc
  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  // Xử lý đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Xử lý xóa thông báo
  const handleDeleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    addNotification,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    clearAllNotifications,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};

export default useNotifications;
