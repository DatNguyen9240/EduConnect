import React, { useState, useEffect, useContext, useCallback } from 'react';
import { onMessage } from 'firebase/messaging';
import type { MessagePayload } from 'firebase/messaging';
import {
  messaging,
  requestNotificationPermission,
  getFCMToken,
  showNotification,
} from '@/config/firebase';
import { registerFirebaseToken, deactivateFirebaseToken } from '@/api/notification.api';
import { AppContext } from './app.context';
import { NotificationContext, type NotificationPayload } from './notification-context';
import { useQueryClient } from '@tanstack/react-query';
import type { Notification } from '@/types/notification.type';

export { NotificationContext };

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isTokenRegistered, setIsTokenRegistered] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<NotificationPayload | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AppContext);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // Theo dõi messageId để tránh xử lý trùng lặp
  const [processedMessageIds] = useState<Set<string>>(new Set());

  // Hàm lưu thông báo vào localStorage
  const saveNotificationToLocalStorage = (notification: Notification) => {
    try {
      // Lấy danh sách thông báo hiện có
      const storedNotifications = localStorage.getItem('educonnect_notifications');
      let notifications: Notification[] = [];

      if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
      }

      // Kiểm tra xem thông báo đã tồn tại chưa (dựa vào messageId hoặc nội dung)
      const exists = notifications.some(
        (n) =>
          (notification.data?.messageId && n.data?.messageId === notification.data.messageId) ||
          (n.title === notification.title && n.body === notification.body)
      );

      if (!exists) {
        // Thêm thông báo mới vào đầu danh sách
        notifications.unshift(notification);

        // Giới hạn số lượng thông báo lưu trữ (tối đa 100)
        if (notifications.length > 100) {
          notifications = notifications.slice(0, 100);
        }

        // Lưu lại vào localStorage
        localStorage.setItem('educonnect_notifications', JSON.stringify(notifications));
      }
    } catch (error) {
      console.error('Error saving notification to localStorage:', error);
    }
  };

  // Kiểm tra xem token đã được đăng ký chưa
  const checkTokenRegistration = useCallback((): boolean => {
    const storageKey = 'educonnect_fcm_token_registered';
    return localStorage.getItem(storageKey) === 'true';
  }, []);

  // Đánh dấu token đã được đăng ký
  const markTokenAsRegistered = useCallback((token: string): void => {
    const storageKey = 'educonnect_fcm_token_registered';
    localStorage.setItem(storageKey, 'true');

    // Lưu token đã đăng ký
    localStorage.setItem('educonnect_fcm_token', token);

    setIsTokenRegistered(true);
  }, []);

  // Đăng ký token với backend
  const registerDeviceToken = useCallback(
    async (forceRegister: boolean = false): Promise<boolean> => {
      try {
        if (!isAuthenticated) {
          return false;
        }

        // Kiểm tra xem token đã được đăng ký trước đó chưa
        const isAlreadyRegistered = checkTokenRegistration();
        if (isAlreadyRegistered && !forceRegister) {
          setIsTokenRegistered(true);

          // Khôi phục token từ localStorage
          const savedToken = localStorage.getItem('educonnect_fcm_token');
          if (savedToken) {
            setDeviceToken(savedToken);
          }

          return true;
        }

        const fcmToken = await getFCMToken();

        if (!fcmToken) {
          // Nếu không lấy được token, vẫn đánh dấu là có quyền để có thể hiển thị thông báo local
          if (Notification.permission === 'granted') {
            setHasPermission(true);
            // Không đăng ký với backend nhưng vẫn cho phép thông báo local
            return true;
          }
          return false;
        }

        setDeviceToken(fcmToken);

        // Lấy ID thiết bị
        const deviceId = getDeviceId();

        try {
          // Đăng ký token với backend
          const requestData = {
            fcmToken,
            deviceType: getDeviceType(),
            deviceId,
          };

          const response = await registerFirebaseToken(requestData);

          if (response.success) {
            markTokenAsRegistered(fcmToken);
            return true;
          } else {
            // Vẫn đánh dấu là có quyền để có thể hiển thị thông báo local
            if (Notification.permission === 'granted') {
              setHasPermission(true);
            }
            return true; // Trả về true để vẫn cho phép thông báo local
          }
        } catch (error) {
          console.error('Error registering FCM token with backend:', error);
          // Vẫn đánh dấu là có quyền để có thể hiển thị thông báo local
          if (Notification.permission === 'granted') {
            setHasPermission(true);
            return true; // Trả về true để vẫn cho phép thông báo local
          }
          return false;
        }
      } catch (error) {
        console.error('Error registering device token:', error);

        // Vẫn đánh dấu là có quyền để có thể hiển thị thông báo local
        if (Notification.permission === 'granted') {
          setHasPermission(true);
          return true;
        }
        return false;
      }
    },
    [isAuthenticated, checkTokenRegistration, markTokenAsRegistered]
  );

  // Kiểm tra quyền và lấy token khi component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const permission = await requestNotificationPermission();
        setHasPermission(permission);

        return permission;
      } catch (error) {
        console.error('Error checking notification permission:', error);
        return false;
      }
    };

    if (!isInitialized) {
      checkPermission().then((permission) => {
        if (permission && isAuthenticated) {
          // Kiểm tra xem token đã được đăng ký chưa
          const isAlreadyRegistered = checkTokenRegistration();
          if (isAlreadyRegistered) {
            setIsTokenRegistered(true);

            // Khôi phục token từ localStorage
            const savedToken = localStorage.getItem('educonnect_fcm_token');
            if (savedToken) {
              setDeviceToken(savedToken);
            }
          } else {
            registerDeviceToken().catch((err) => {
              console.error('Error in initial token registration:', err);
            });
          }
        }
        setIsInitialized(true);
      });
    }
  }, [isAuthenticated, isInitialized, registerDeviceToken, checkTokenRegistration]);

  // Xử lý khi đăng nhập/đăng xuất
  useEffect(() => {
    if (isAuthenticated && isInitialized) {
      // Kiểm tra xem token đã được đăng ký chưa
      const isAlreadyRegistered = checkTokenRegistration();
      if (!isAlreadyRegistered) {
        registerDeviceToken().catch((err) => {
          console.error('Error registering token after login:', err);
        });
      }
    } else if (!isAuthenticated && isInitialized) {
      // Khi đăng xuất, xóa thông tin token đã đăng ký
      localStorage.removeItem('educonnect_fcm_token_registered');
      localStorage.removeItem('educonnect_fcm_token');
      setIsTokenRegistered(false);
      setDeviceToken(null);
    }
  }, [isAuthenticated, isInitialized, registerDeviceToken, checkTokenRegistration]);

  // Xử lý điều hướng dựa trên loại thông báo
  const handleNotificationNavigation = (payload: MessagePayload) => {
    if (!payload.data) return;

    // Dữ liệu thông báo đã sẵn có nhưng không cần thực hiện điều hướng tại đây
    // Điều hướng sẽ được xử lý bởi useNotificationNavigation hook
  };

  // Thêm thông báo vào danh sách thông báo
  const addNotificationToList = (payload: MessagePayload) => {
    if (!payload.notification) return;

    // Kiểm tra messageId để tránh xử lý trùng lặp
    const messageId = payload.messageId || `msg-${Date.now()}`;

    if (processedMessageIds.has(messageId)) {
      return;
    }

    // Đánh dấu đã xử lý messageId này
    processedMessageIds.add(messageId);

    // Lấy dữ liệu từ cache
    const cachedData = queryClient.getQueryData<{ data: Notification[] }>(['notifications']);

    if (!cachedData) {
      // Nếu chưa có dữ liệu trong cache, tạo mới
      queryClient.setQueryData(['notifications'], {
        data: [],
      });
    }

    // Tạo thông báo mới
    const newNotification: Notification = {
      id: `fcm-${Date.now()}`,
      title: payload.notification.title || 'Thông báo mới',
      body: payload.notification.body || 'Bạn có thông báo mới',
      type: determineNotificationType(payload.data || {}),
      read: false,
      timestamp: new Date().toISOString(),
      data: payload.data ? { ...payload.data, messageId } : { messageId },
    };

    // Lưu vào localStorage
    saveNotificationToLocalStorage(newNotification);

    // Cập nhật cache
    queryClient.setQueryData<{ data: Notification[] }>(['notifications'], (oldData) => {
      const currentData = oldData || { data: [] };
      const newData = {
        ...currentData,
        data: [newNotification, ...(currentData.data || [])],
      };
      return newData;
    });
  };

  // Xác định loại thông báo dựa vào data
  const determineNotificationType = (data: Record<string, unknown>): Notification['type'] => {
    if (!data) return 'system';

    if (data.type === 'exam_notification' || data.exam_id) {
      return 'exam';
    }

    if (data.type === 'class_notification' || data.class_id) {
      return 'class';
    }

    if (data.type === 'grade_notification') {
      return 'grade';
    }

    return 'system';
  };

  // Đăng ký lắng nghe thông báo khi ứng dụng đang mở
  useEffect(() => {
    if (!messaging) {
      return;
    }

    try {
      const unsubscribe = onMessage(messaging, (payload) => {
        setLastNotification(payload as unknown as NotificationPayload);

        // Hiển thị thông báo ngay cả khi app đang mở
        if (payload.notification) {
          const { title, body } = payload.notification;
          showNotification(title || 'Thông báo mới', body || 'Bạn có thông báo mới', payload.data);

          // Thêm thông báo vào danh sách thông báo
          addNotificationToList(payload);
        }

        // Xử lý điều hướng nếu cần
        handleNotificationNavigation(payload);
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }, [queryClient, processedMessageIds]);

  // Hiển thị thông báo kiểm tra
  const showTestNotification = () => {
    // Tạo nội dung thông báo
    const title = 'Thông báo kiểm tra';
    const body = `Đây là thông báo kiểm tra được gửi lúc ${new Date().toLocaleTimeString()}`;
    const data = {
      type: 'test_notification',
      timestamp: new Date().toISOString(),
    };

    // Hiển thị thông báo
    showNotification(title, body, data);

    // Tạo MessagePayload giả lập để thêm vào danh sách thông báo
    const mockPayload: MessagePayload = {
      notification: {
        title,
        body,
      },
      data,
      from: '',
      messageId: `test-${Date.now()}`,
      collapseKey: '',
    };

    // Thêm thông báo kiểm tra vào danh sách thông báo
    addNotificationToList(mockPayload);
  };

  // Hủy đăng ký token với backend
  const unregisterDeviceToken = async (): Promise<boolean> => {
    try {
      if (!deviceToken) {
        return false;
      }

      // Lấy ID thiết bị
      const deviceId = getDeviceId();

      // Hủy đăng ký token với backend
      const response = await deactivateFirebaseToken(deviceId);

      if (response.success) {
        setIsTokenRegistered(false);
        setDeviceToken(null);

        // Xóa thông tin token đã đăng ký
        localStorage.removeItem('educonnect_fcm_token_registered');
        localStorage.removeItem('educonnect_fcm_token');

        return true;
      } else {
        console.error('Failed to unregister FCM token with backend:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Error unregistering device token:', error);
      return false;
    }
  };

  // Lấy loại thiết bị
  const getDeviceType = (): string => {
    // Xác định thiết bị dựa vào user agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
    return 'Web';
  };

  // Tạo device ID độc nhất cho thiết bị
  const getDeviceId = (): string => {
    const storageKey = 'educonnect_device_id';
    let deviceId = localStorage.getItem(storageKey);

    if (!deviceId) {
      // Tạo ID thiết bị mới nếu chưa có
      deviceId = `web_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
      localStorage.setItem(storageKey, deviceId);
    }

    return deviceId;
  };

  return (
    <NotificationContext.Provider
      value={{
        hasPermission,
        isTokenRegistered,
        lastNotification,
        registerDeviceToken: () => registerDeviceToken(true), // Cho phép force register khi gọi từ bên ngoài
        unregisterDeviceToken,
        showTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
