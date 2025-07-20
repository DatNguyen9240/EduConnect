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

export { NotificationContext };

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isTokenRegistered, setIsTokenRegistered] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<NotificationPayload | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AppContext);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Đăng ký token với backend
  const registerDeviceToken = useCallback(async (): Promise<boolean> => {
    try {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping token registration');
        return false;
      }

      console.log('Getting FCM token...');
      const fcmToken = await getFCMToken();

      if (!fcmToken) {
        console.log('Failed to get FCM token, using fallback approach');

        // Nếu không lấy được token, vẫn đánh dấu là có quyền để có thể hiển thị thông báo local
        if (Notification.permission === 'granted') {
          setHasPermission(true);
          // Không đăng ký với backend nhưng vẫn cho phép thông báo local
          return true;
        }
        return false;
      }

      console.log('FCM token obtained, registering with backend...');
      setDeviceToken(fcmToken);

      // Lấy ID thiết bị
      const deviceId = getDeviceId();

      try {
        // Đăng ký token với backend
        const response = await registerFirebaseToken({
          fcmToken,
          deviceType: getDeviceType(),
          deviceId,
        });

        if (response.success) {
          console.log('FCM token registered with backend');
          setIsTokenRegistered(true);
          return true;
        } else {
          console.error('Failed to register FCM token with backend:', response.message);
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
  }, [isAuthenticated]);

  // Kiểm tra quyền và lấy token khi component mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        console.log('Checking notification permission...');
        const permission = await requestNotificationPermission();
        setHasPermission(permission);

        if (permission) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission not granted');
        }

        return permission;
      } catch (error) {
        console.error('Error checking notification permission:', error);
        return false;
      }
    };

    if (!isInitialized) {
      checkPermission().then((permission) => {
        if (permission && isAuthenticated) {
          console.log('User is authenticated, registering device token...');
          registerDeviceToken().catch((err) => {
            console.error('Error in initial token registration:', err);
          });
        }
        setIsInitialized(true);
      });
    }
  }, [isAuthenticated, isInitialized, registerDeviceToken]);

  // Xử lý điều hướng dựa trên loại thông báo
  const handleNotificationNavigation = (payload: MessagePayload) => {
    if (!payload.data) return;

    const data = payload.data;
    const type = data.type;
    const exam_id = data.exam_id;
    const class_id = data.class_id;

    // Thay vì lưu vào localStorage, chỉ log thông tin
    if (type === 'exam_notification' && exam_id) {
      console.log('Notification navigation: exam notification', exam_id);
      // Điều hướng sẽ được xử lý bởi useNotificationNavigation hook
    } else if (type === 'class_notification' && class_id) {
      console.log('Notification navigation: class notification', class_id);
      // Điều hướng sẽ được xử lý bởi useNotificationNavigation hook
    }
  };

  // Đăng ký lắng nghe thông báo khi ứng dụng đang mở
  useEffect(() => {
    if (!messaging) {
      console.warn('Firebase messaging is not available');
      return;
    }

    try {
      console.log('Setting up foreground message listener...');
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload);
        setLastNotification(payload as unknown as NotificationPayload);

        // Hiển thị thông báo ngay cả khi app đang mở
        if (payload.notification) {
          const { title, body } = payload.notification;
          showNotification(title || 'Thông báo mới', body || 'Bạn có thông báo mới', payload.data);
        }

        // Xử lý điều hướng nếu cần
        handleNotificationNavigation(payload);
      });

      return () => {
        console.log('Cleaning up message listener');
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up message listener:', error);
    }
  }, []);

  // Hiển thị thông báo kiểm tra
  const showTestNotification = () => {
    showNotification(
      'Thông báo kiểm tra',
      `Đây là thông báo kiểm tra được gửi lúc ${new Date().toLocaleTimeString()}`,
      { type: 'test_notification' }
    );
  };

  // Hủy đăng ký token với backend
  const unregisterDeviceToken = async (): Promise<boolean> => {
    try {
      if (!deviceToken) {
        console.log('No device token to unregister');
        return false;
      }

      // Lấy ID thiết bị
      const deviceId = getDeviceId();

      // Hủy đăng ký token với backend
      const response = await deactivateFirebaseToken(deviceId);

      if (response.success) {
        console.log('FCM token unregistered with backend');
        setIsTokenRegistered(false);
        setDeviceToken(null);
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
        registerDeviceToken,
        unregisterDeviceToken,
        showTestNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
