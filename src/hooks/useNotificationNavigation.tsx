import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook để xử lý việc điều hướng từ thông báo
 * Sử dụng hook này trong các component bên trong Router
 */
export const useNotificationNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem có điều hướng đang chờ không
    const pendingNavigation = localStorage.getItem('pendingNavigation');
    if (pendingNavigation) {
      // Xóa thông tin điều hướng đã lưu
      localStorage.removeItem('pendingNavigation');

      // Thực hiện điều hướng
      navigate(pendingNavigation);
    }

    // Đăng ký lắng nghe message từ service worker
    const messageHandler = (event: MessageEvent) => {
      // Kiểm tra xem có phải message từ service worker không
      if (
        event.data &&
        typeof event.data === 'object' &&
        event.data.type === 'NOTIFICATION_CLICK'
      ) {
        // Nếu có pendingNavigation trong message, thực hiện điều hướng
        const { pendingNavigation } = event.data;
        if (pendingNavigation && typeof pendingNavigation === 'string') {
          navigate(pendingNavigation);
        }
      }
    };

    // Đăng ký listener
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', messageHandler);
    }

    // Cleanup listener khi component unmount
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      }
    };
  }, [navigate]);

  // Hàm này có thể được gọi để xử lý điều hướng từ thông báo
  const handleNotificationClick = (notificationType: string, data: Record<string, string>) => {
    switch (notificationType) {
      case 'exam_notification':
        if (data.exam_id) {
          navigate(`/lich-thi?examId=${data.exam_id}`);
        }
        break;
      case 'class_notification':
        if (data.class_id) {
          navigate(`/class/${data.class_id}`);
        }
        break;
      default:
        break;
    }
  };

  return { handleNotificationClick };
};

export default useNotificationNavigation;
