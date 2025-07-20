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

// Xử lý background message
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'EduConnect';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có thông báo mới',
    icon: '/assets/logo/logo.png', // Path icon chính xác
    badge: '/assets/logo/logo.png',
    data: payload.data || {},
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
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'open') {
    // Mở app hoặc tab mới
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Chỉ đóng notification
    event.notification.close();
  } else {
    // Click vào notification chính
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Tìm tab đang mở
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }
        // Nếu không tìm thấy tab nào, mở tab mới
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Xử lý khi notification đóng
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});

// Xử lý push event (cho các trường hợp khác)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);

  if (event.data) {
    const data = event.data.json();
    const notificationTitle = data.notification?.title || 'EduConnect';
    const notificationOptions = {
      body: data.notification?.body || 'Bạn có thông báo mới',
      icon: '/assets/logo/logo.png',
      badge: '/assets/logo/logo.png',
      data: data.data || {},
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
}); 