# Google Login Setup Guide

## Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API và Google OAuth2 API
4. Vào "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth 2.0 Client IDs"
6. Chọn "Web application"
7. Thêm Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Domain production của bạn
8. Copy Client ID

## Bước 2: Cấu hình Environment Variables

Tạo file `.env` trong thư mục root:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

## Bước 3: Test

1. Chạy `npm run dev`
2. Vào trang login
3. Click "Continue with Google"
4. Hoàn thành OAuth flow

## Lưu ý

- Đảm bảo domain được thêm vào Authorized origins trong Google Cloud Console
- Sử dụng HTTPS trong production
- Không commit Client ID vào git
