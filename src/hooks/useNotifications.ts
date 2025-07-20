import type { Notification } from '@/types/notification.type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Các API calls
const fetchNotifications = async (): Promise<{ data: Notification[] }> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // return api.get<{ data: Notification[] }>('/api/v1/notifications');

  // Dữ liệu mẫu
  return {
    data: [
      {
        id: '1',
        title: 'Lịch thi học kỳ 2',
        body: 'Lịch thi học kỳ 2 năm học 2023-2024 đã được cập nhật. Vui lòng kiểm tra.',
        type: 'exam',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 phút trước
        data: { exam_id: '123' },
      },
      {
        id: '2',
        title: 'Thông báo lớp học',
        body: 'Lớp Toán sẽ nghỉ học vào ngày 15/05/2024. Buổi học sẽ được bù vào tuần sau.',
        type: 'class',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 giờ trước
        data: { class_id: '456' },
      },
      {
        id: '3',
        title: 'Điểm kiểm tra giữa kỳ',
        body: 'Điểm kiểm tra giữa kỳ môn Vật lý đã được cập nhật. Xem ngay!',
        type: 'grade',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 ngày trước
      },
      {
        id: '4',
        title: 'Cập nhật hệ thống',
        body: 'Hệ thống EduConnect vừa được cập nhật với nhiều tính năng mới.',
        type: 'system',
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 ngày trước
      },
      {
        id: '5',
        title: 'Lịch thi cuối kỳ',
        body: 'Lịch thi cuối kỳ năm học 2023-2024 đã được cập nhật. Vui lòng kiểm tra.',
        type: 'exam',
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 ngày trước
        data: { exam_id: '789' },
      },
    ],
  };
};

const markAsRead = async (id: string): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // return api.put(`/api/v1/notifications/${id}/read`);
  console.log(`Marking notification ${id} as read`);
  return Promise.resolve();
};

const markAllAsRead = async (): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // return api.put('/api/v1/notifications/read-all');
  console.log('Marking all notifications as read');
  return Promise.resolve();
};

const deleteNotification = async (id: string): Promise<void> => {
  // Trong thực tế, đây sẽ là API call đến backend
  // return api.delete(`/api/v1/notifications/${id}`);
  console.log(`Deleting notification ${id}`);
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

  // Mutation để đánh dấu đã đọc
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] });
      const previousData = queryClient.getQueryData<{ data: Notification[] }>(['notifications']);

      if (previousData) {
        queryClient.setQueryData(['notifications'], {
          data: previousData.data.map((n) => (n.id === id ? { ...n, read: true } : n)),
        });
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
        queryClient.setQueryData(['notifications'], {
          data: previousData.data.map((n) => ({ ...n, read: true })),
        });
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
        queryClient.setQueryData(['notifications'], {
          data: previousData.data.filter((n) => n.id !== id),
        });
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
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};

export default useNotifications;
