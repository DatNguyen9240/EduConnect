// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Cấu hình Firebase - đồng bộ với file src/config/firebase.ts
const firebaseConfig = {
  apiKey: 'AIzaSyDtYcoRAqUEGgZloIqu938lVMiMC_2xPPk',
  authDomain: 'educonnect-40f91.firebaseapp.com',
  projectId: 'educonnect-40f91',
  storageBucket: 'educonnect-40f91.firebasestorage.app',
  messagingSenderId: '1007241778919',
  appId: '1:1007241778919:web:7963fbc6d0e9f746a1b442',
  measurementId: 'G-37HM8BL1CN',
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Khởi tạo messaging
const messaging = firebase.messaging();

// Theo dõi thông báo đã hiển thị để tránh trùng lặp
const displayedNotifications = new Map();

// Kiểm tra trùng lặp thông báo
const isNotificationDuplicate = (payload) => {
  // Tạo ID duy nhất cho thông báo này dựa trên nội dung
  const notificationId = `${payload.notification?.title || ''}-${payload.notification?.body || ''}-${JSON.stringify(payload.data || {})}`;
  
  // Kiểm tra xem thông báo này đã hiển thị gần đây chưa
  const lastDisplayed = displayedNotifications.get(notificationId);
  const now = Date.now();
  
  if (lastDisplayed && (now - lastDisplayed) < 10000) { // 10 giây
    return true;
  }
  
  // Lưu thời gian hiển thị
  displayedNotifications.set(notificationId, now);
  
  // Giới hạn kích thước Map
  if (displayedNotifications.size > 100) {
    // Xóa mục cũ nhất
    const oldestKey = displayedNotifications.keys().next().value;
    displayedNotifications.delete(oldestKey);
  }
  
  return false;
};

// Xử lý background message
messaging.onBackgroundMessage((payload) => {
  // Kiểm tra trùng lặp
  if (isNotificationDuplicate(payload)) {
    return;
  }

  const notificationTitle = payload.notification?.title || 'EduConnect';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có thông báo mới',
    icon: '/assets/logo/logo.png', // Path icon chính xác
    badge: '/assets/logo/logo.png',
    data: payload.data || {},
    tag: `educonnect-${Date.now()}`, // Thêm tag để tránh trùng lặp
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Mở',
        icon: '/assets/logo/logo.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/assets/logo/logo.png'
      }
    ]
  };

  // Hiển thị notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Xử lý khi click vào notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Lấy dữ liệu từ thông báo
  const data = event.notification.data || {};
  const { type, exam_id, class_id } = data;
  
  // Xác định URL cần điều hướng
  let navigateUrl = '/';
  
  if (event.action === 'open' || !event.action) {
    switch (type) {
      case 'exam_notification':
        if (exam_id) {
          navigateUrl = `/lich-thi?examId=${exam_id}`;
        }
        break;
      case 'class_notification':
        if (class_id) {
          navigateUrl = `/class/${class_id}`;
        }
        break;
      default:
        navigateUrl = '/';
    }

    // Lưu thông tin điều hướng vào localStorage để được xử lý sau khi app mở
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Tìm tab đang mở
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Nếu đã có tab mở, lưu thông tin điều hướng và focus vào tab đó
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              pendingNavigation: navigateUrl
            });
            return client.focus();
          }
        }
        
        // Nếu không tìm thấy tab nào, mở tab mới với URL đích
        if (clients.openWindow) {
          return clients.openWindow(navigateUrl);
        }
      })
    );
  } else if (event.action === 'close') {
    // Chỉ đóng notification
    event.notification.close();
  }
});

// Xử lý khi notification đóng
self.addEventListener('notificationclose', (event) => {
  // Không cần làm gì đặc biệt khi đóng thông báo
});

// Xử lý push event (cho các trường hợp khác)
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      
      // Kiểm tra trùng lặp
      if (isNotificationDuplicate(data)) {
        return;
      }
      
      const notificationTitle = data.notification?.title || 'EduConnect';
      const notificationOptions = {
        body: data.notification?.body || 'Bạn có thông báo mới',
        icon: '/assets/logo/logo.png',
        badge: '/assets/logo/logo.png',
        data: data.data || {},
        tag: `educonnect-${Date.now()}`, // Thêm tag để tránh trùng lặp
        requireInteraction: true
      };

      event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
      );
    } catch (error) {
      console.error('Error processing push event:', error);
    }
  }
}); 