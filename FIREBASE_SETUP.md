# Firebase Notification Setup

## 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Thêm web app vào project

## 2. Cấu hình Web App

### 2.1. Lấy thông tin cấu hình

Sau khi thêm web app, Firebase sẽ cung cấp thông tin cấu hình:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 2.2. Cập nhật file cấu hình

Cập nhật thông tin trong file `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

## 3. Cấu hình Cloud Messaging

### 3.1. Tạo VAPID Key

1. Vào **Project Settings** > **Cloud Messaging**
2. Tạo **Web Push certificates**
3. Copy **Key pair** (VAPID key)

### 3.2. Cập nhật VAPID Key

Cập nhật VAPID key trong file `src/config/firebase.ts`:

```typescript
const vapidKey = "YOUR_ACTUAL_VAPID_KEY";
```

### 3.3. Cập nhật Service Worker

Cập nhật thông tin Firebase trong file `public/firebase-messaging-sw.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
};
```

## 4. Cấu hình Backend

### 4.1. Cập nhật appsettings.json

Cập nhật thông tin Firebase trong file `appsettings.json`:

```json
{
  "Firebase": {
    "Url": "https://fcm.googleapis.com/fcm/send",
    "ServerKey": "YOUR_FIREBASE_SERVER_KEY",
    "ProjectId": "YOUR_PROJECT_ID",
    "ServiceAccountKeyPath": "path/to/service-account-key.json",
    "ServiceAccountJson": "YOUR_SERVICE_ACCOUNT_JSON_STRING"
  }
}
```

### 4.2. Lấy Server Key

1. Vào **Project Settings** > **Cloud Messaging**
2. Copy **Server key** từ **Project credentials**

### 4.3. Tạo Service Account

1. Vào **Project Settings** > **Service accounts**
2. Tạo **Firebase Admin SDK**
3. Download file JSON hoặc copy JSON string

## 5. Test Notification

### 5.1. Test từ Firebase Console

1. Vào **Cloud Messaging** > **Send your first message**
2. Chọn **Single device** và nhập FCM token
3. Gửi test message

### 5.2. Test từ Backend

Sử dụng API endpoint để gửi notification:

```bash
POST /api/v1/firebase-tokens
{
  "deviceType": "Web",
  "fcmToken": "YOUR_FCM_TOKEN"
}
```

## 6. Troubleshooting

### 6.1. Service Worker không đăng ký

- Kiểm tra HTTPS (Firebase yêu cầu HTTPS)
- Kiểm tra đường dẫn service worker
- Kiểm tra console errors

### 6.2. Không nhận được notification

- Kiểm tra quyền notification
- Kiểm tra FCM token có hợp lệ
- Kiểm tra backend logs

### 6.3. Background notification không hoạt động

- Kiểm tra service worker đã đăng ký
- Kiểm tra manifest.json
- Kiểm tra browser support

## 7. Browser Support

Firebase Cloud Messaging hỗ trợ:
- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

## 8. Security

- Không commit thông tin Firebase vào git
- Sử dụng environment variables
- Bảo vệ Server Key
- Validate FCM tokens

## 9. Production Checklist

- [ ] HTTPS enabled
- [ ] Firebase config updated
- [ ] VAPID key configured
- [ ] Service worker registered
- [ ] Backend Firebase config updated
- [ ] Test notifications working
- [ ] Error handling implemented
- [ ] Security measures in place 