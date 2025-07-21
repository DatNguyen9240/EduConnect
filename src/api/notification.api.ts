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
  try {
    return await api.post<ApiResponse<FirebaseTokenResponse>>('/api/v1/firebase-tokens', request);
  } catch (error) {
    console.error('Error registering Firebase token:', error);
    // Trả về response giả để tránh lỗi
    return {
      success: false,
      message: 'Failed to register Firebase token due to authentication issues',
      error: ['Authentication error'],
    };
  }
};

// Cập nhật FCM token
export const updateFirebaseToken = async (
  request: UpdateFirebaseTokenRequest
): Promise<ApiResponse<string>> => {
  try {
    return await api.put<ApiResponse<string>>('/api/v1/firebase-tokens', request);
  } catch (error) {
    console.error('Error updating Firebase token:', error);
    return {
      success: false,
      message: 'Failed to update Firebase token',
      error: ['Request failed'],
    };
  }
};

// Hủy kích hoạt FCM token
export const deactivateFirebaseToken = async (deviceId?: string): Promise<ApiResponse<string>> => {
  try {
    const params = deviceId ? { deviceId } : {};
    return await api.delete<ApiResponse<string>>('/api/v1/firebase-tokens', { params });
  } catch (error) {
    console.error('Error deactivating Firebase token:', error);
    return {
      success: false,
      message: 'Failed to deactivate Firebase token',
      error: ['Request failed'],
    };
  }
};
