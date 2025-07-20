import api from '@/lib/axios';

export interface FirebaseTokenRequest {
  deviceType: string;
  fcmToken: string;
  deviceId?: string;
  [key: string]: unknown;
}

export interface FirebaseTokenResponse {
  token: string;
  deviceType: string;
  deviceId?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface UpdateFirebaseTokenRequest {
  token: string;
  deviceType?: string;
  deviceId?: string;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | string[];
}

// Đăng ký hoặc cập nhật FCM token
export const registerFirebaseToken = async (
  request: FirebaseTokenRequest
): Promise<ApiResponse<FirebaseTokenResponse>> => {
  return api.post<ApiResponse<FirebaseTokenResponse>>('/api/v1/firebase-tokens', request);
};

// Cập nhật FCM token
export const updateFirebaseToken = async (
  request: UpdateFirebaseTokenRequest
): Promise<ApiResponse<string>> => {
  return api.put<ApiResponse<string>>('/api/v1/firebase-tokens', request);
};

// Hủy kích hoạt FCM token
export const deactivateFirebaseToken = async (deviceId?: string): Promise<ApiResponse<string>> => {
  const params = deviceId ? { deviceId } : {};
  return api.delete<ApiResponse<string>>('/api/v1/firebase-tokens', { params });
};
