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
// ⚠️ Cần thay thế bằng VAPID key mới từ Firebase Console
const vapidKey =
  'BLgnlypmnlwllqH7lU4QauycUeBrLq5XG5m6s2PKH9sYN6ewIMwIGD5LTjDBtd9h3DV6RMRE32qhxfT3rYCwbvY';

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
        return null;
      }
    }

    // Kiểm tra service worker
    if ('serviceWorker' in navigator) {
      try {
        // Đăng ký service worker mới
        const registration = await navigator.serviceWorker.register(swPath);

        // Đảm bảo service worker đã active
        const serviceWorker =
          registration?.active || registration?.installing || registration?.waiting;

        if (!serviceWorker) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    } else {
      return null;
    }

    try {
      // Lấy FCM token
      const token = await getToken(messaging, { vapidKey });
      return token;
    } catch (error: unknown) {
      console.error('Error getting FCM token:', error);

      // Hiển thị chi tiết lỗi Firebase
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        const firebaseError = error as { code: string; message: string };
        console.error(`Firebase error (${firebaseError.code}): ${firebaseError.message}`);

        if (firebaseError.code === 'messaging/permission-blocked') {
          console.error('User has blocked notifications. Please check browser settings.');
        } else if (firebaseError.code === 'messaging/token-subscribe-failed') {
          console.error('Token subscribe failed. Check VAPID key and Firebase configuration.');
        }
      }

      return null;
    }
  } catch (error) {
    console.error('General error in getFCMToken:', error);
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
        resolve(payload);
      });
    } catch (error) {
      console.error('Error setting up message listener:', error);
      reject(error);
    }
  });
};

// Biến để theo dõi thông báo đã hiển thị
const displayedNotifications = new Set<string>();

// Hàm tạo notification khi app đang mở
export const showNotification = (title: string, body: string, data?: Record<string, unknown>) => {
  if (Notification.permission !== 'granted') {
    return;
  }

  // Tạo ID duy nhất cho thông báo này
  const notificationId = `${title}-${body}-${Date.now()}`;

  // Kiểm tra xem thông báo này đã hiển thị chưa
  if (displayedNotifications.has(notificationId)) {
    return;
  }

  // Thêm vào danh sách đã hiển thị
  displayedNotifications.add(notificationId);

  // Xóa ID thông báo cũ sau 10 giây để tránh set quá lớn
  setTimeout(() => {
    displayedNotifications.delete(notificationId);
  }, 10000);

  try {
    // Không hiển thị thông báo khi ứng dụng đang mở, chỉ thêm vào danh sách thông báo
    // Thông báo sẽ được hiển thị trong UI của ứng dụng

    // Chỉ trả về thông tin thông báo mà không hiển thị
    return {
      title,
      body,
      data,
      close: () => {},
    };

    /* Đã vô hiệu hóa code hiển thị thông báo trình duyệt
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

      // Lưu thông tin điều hướng vào localStorage
      if (data?.type === 'exam_notification' && data?.exam_id) {
        localStorage.setItem('pendingNavigation', `/lich-thi?examId=${data.exam_id}`);
      } else if (data?.type === 'class_notification' && data?.class_id) {
        localStorage.setItem('pendingNavigation', `/class/${data.class_id}`);
      } else if (data?.url && typeof data.url === 'string') {
        window.open(data.url, '_blank');
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
    */
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

export default app;
