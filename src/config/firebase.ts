import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Cấu hình Firebase - bạn cần thay thế bằng thông tin thực từ Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyDtYcoRAqUEGgZloIqu938lVMiMC_2xPPk',
  authDomain: 'educonnect-40f91.firebaseapp.com',
  projectId: 'educonnect-40f91',
  storageBucket: 'educonnect-40f91.firebasestorage.app',
  messagingSenderId: '1007241778919',
  appId: '1:1007241778919:web:7963fbc6d0e9f746a1b442',
  measurementId: 'G-37HM8BL1CN',
};

// Khởi tạo Firebase app
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase messaging
export const messaging = getMessaging(app);

// VAPID key cho web push notifications
// Lấy từ Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
const vapidKey =
  'BHUDdpnWKj3qs6QZwYTJDNQHFhk-6VDvVMCmQvZ0_-JlnRUZJxSm-U1_KxWbwHjVnxZKN5KfGPDMTbIGBEI1Hhc';

// Service worker path
const swPath = '/firebase-messaging-sw.js';

// Hàm yêu cầu quyền notification
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Hàm lấy FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Kiểm tra quyền notification
    if (Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        console.log('Notification permission denied');
        return null;
      }
    }

    // Kiểm tra service worker
    if ('serviceWorker' in navigator) {
      try {
        // Kiểm tra xem service worker đã được đăng ký chưa
        const registration = await navigator.serviceWorker.getRegistration(swPath);

        if (!registration) {
          // Nếu chưa đăng ký, đăng ký mới
          await navigator.serviceWorker.register(swPath);
          console.log('Service Worker registered successfully');
        } else {
          console.log('Service Worker already registered');
        }

        // Đảm bảo service worker đã active
        const serviceWorker =
          registration?.active || registration?.installing || registration?.waiting;

        if (!serviceWorker) {
          // Đợi service worker active nếu cần
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }

    // Lấy FCM token
    const token = await getToken(messaging, { vapidKey });
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Hàm này không còn được sử dụng, chỉ giữ lại để tương thích với code cũ
// Thay vào đó, sử dụng trực tiếp onMessage từ firebase/messaging
export const onMessageListener = () => {
  return new Promise<unknown>((resolve, reject) => {
    try {
      // Đăng ký listener
      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        resolve(payload);
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      reject(error);
    }
  });
};

// Hàm tạo notification khi app đang mở
export const showNotification = (title: string, body: string, data?: Record<string, unknown>) => {
  if (Notification.permission !== 'granted') {
    console.warn('Notification permission not granted');
    return;
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/assets/logo/logo.png', // Sửa path icon chính xác
      badge: '/assets/logo/logo.png',
      data,
      requireInteraction: false, // Tự động đóng sau một thời gian
      silent: false, // Cho phép âm thanh thông báo
    });

    // Xử lý khi click vào notification
    notification.onclick = (event) => {
      console.log('Notification clicked:', event);
      notification.close();

      // Điều hướng dựa vào data
      if (data?.url && typeof data.url === 'string') {
        window.open(data.url, '_blank');
      } else if (data?.examId) {
        // Nếu là thông báo về lịch thi
        window.open(`/lich-thi?examId=${data.examId}`, '_self');
      } else {
        // Mặc định focus vào tab hiện tại
        window.focus();
      }
    };

    // Tự động đóng notification sau 8 giây
    setTimeout(() => {
      notification.close();
    }, 8000);

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

export default app;
