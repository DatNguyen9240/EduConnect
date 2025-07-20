import { useEffect, useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getFCMToken, showNotification, messaging } from '@/config/firebase';
import { onMessage } from 'firebase/messaging';
import {
  registerFirebaseToken,
  deactivateFirebaseToken,
  type FirebaseTokenRequest,
} from '@/api/notification.api';
import { toast } from 'react-toastify';

export const useNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Kiểm tra browser support
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 'PushManager' in window;
      setIsSupported(supported);

      if (supported) {
        setIsPermissionGranted(Notification.permission === 'granted');
      }
    };

    checkSupport();
  }, []);

  // Mutation để đăng ký FCM token
  const registerTokenMutation = useMutation({
    mutationFn: (request: FirebaseTokenRequest) => registerFirebaseToken(request),
    onSuccess: (response) => {
      if (response.success) {
        console.log('FCM token registered successfully');
        toast.success('Đăng ký thông báo thành công!');
      } else {
        console.error('Failed to register FCM token:', response.message);
        toast.error('Đăng ký thông báo thất bại: ' + response.message);
      }
    },
    onError: (error) => {
      console.error('Error registering FCM token:', error);
      toast.error('Đăng ký thông báo thất bại!');
    },
  });

  // Mutation để hủy kích hoạt FCM token
  const deactivateTokenMutation = useMutation({
    mutationFn: (deviceId?: string) => deactivateFirebaseToken(deviceId),
    onSuccess: (response) => {
      if (response.success) {
        console.log('FCM token deactivated successfully');
        setFcmToken(null);
        toast.success('Hủy thông báo thành công!');
      } else {
        console.error('Failed to deactivate FCM token:', response.message);
        toast.error('Hủy thông báo thất bại: ' + response.message);
      }
    },
    onError: (error) => {
      console.error('Error deactivating FCM token:', error);
      toast.error('Hủy thông báo thất bại!');
    },
  });

  // Hàm đăng ký notification
  const registerNotification = useCallback(async () => {
    if (!isSupported) {
      toast.error('Trình duyệt không hỗ trợ thông báo!');
      return false;
    }

    try {
      // Kiểm tra quyền notification hiện tại
      if (Notification.permission === 'denied') {
        toast.error('Quyền thông báo đã bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
        return false;
      }

      // Lấy FCM token
      const token = await getFCMToken();
      if (!token) {
        toast.error('Không thể lấy token thông báo!');
        return false;
      }

      setFcmToken(token);

      // Tạo device ID đơn giản và lưu vào localStorage
      const deviceId =
        localStorage.getItem('deviceId') ||
        `web_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem('deviceId', deviceId);

      // Đăng ký với backend
      const response = await registerTokenMutation.mutateAsync({
        deviceType: 'Web',
        fcmToken: token,
        deviceId,
        userId: localStorage.getItem('userId') || undefined,
      });

      if (!response.success) {
        console.error('Backend registration failed:', response.message);
        toast.error(`Đăng ký thông báo thất bại: ${response.message}`);
        return false;
      }

      setIsPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Error registering notification:', error);
      toast.error('Đăng ký thông báo thất bại!');
      return false;
    }
  }, [isSupported, registerTokenMutation]);

  // Hàm hủy notification
  const unregisterNotification = useCallback(async () => {
    try {
      const deviceId = localStorage.getItem('deviceId');
      await deactivateTokenMutation.mutateAsync(deviceId || undefined);

      // Xóa device ID
      localStorage.removeItem('deviceId');
      setIsPermissionGranted(false);
      return true;
    } catch (error) {
      console.error('Error unregistering notification:', error);
      toast.error('Hủy thông báo thất bại!');
      return false;
    }
  }, [deactivateTokenMutation]);

  // Lắng nghe notification khi app đang mở
  useEffect(() => {
    // Tạo biến để theo dõi xem component có còn mounted không
    let isMounted = true;

    // Hàm xử lý thông báo
    const handleMessage = (payload: unknown) => {
      // Nếu component đã unmounted, không xử lý
      if (!isMounted) return;

      console.log('Foreground message received:', payload);

      // Type guard để kiểm tra payload
      if (payload && typeof payload === 'object' && 'notification' in payload) {
        const notification = (payload as { notification?: { title?: string; body?: string } })
          .notification;
        const data = (payload as { data?: Record<string, unknown> }).data || {};

        const title = notification?.title || 'EduConnect';
        const body = notification?.body || 'Bạn có thông báo mới';

        showNotification(title, body, data);

        // Hiển thị toast
        toast.info(body, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    // Đăng ký listener khi permission được cấp
    if (isPermissionGranted) {
      try {
        // Sử dụng Firebase API trực tiếp để đăng ký listener
        const unsubscribe = onMessage(messaging, handleMessage);

        // Cleanup function
        return () => {
          isMounted = false;
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error setting up message listener:', error);
      }
    }

    // Cleanup function nếu không đăng ký listener
    return () => {
      isMounted = false;
    };
  }, [isPermissionGranted]);

  return {
    isSupported,
    isPermissionGranted,
    fcmToken,
    registerNotification,
    unregisterNotification,
    isLoading: registerTokenMutation.isPending || deactivateTokenMutation.isPending,
  };
};
