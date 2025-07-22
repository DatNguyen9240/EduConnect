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

// Interface cho Axios error
interface AxiosErrorResponse {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
}

// Đăng ký hoặc cập nhật FCM token
export const registerFirebaseToken = async (request: {
  fcmToken: string;
  deviceType: string;
  deviceId?: string;
  [key: string]: unknown;
}): Promise<ApiResponse<FirebaseTokenResponse>> => {
  try {
    // Không cần chuyển đổi tên trường nữa, sử dụng trực tiếp request
    const response = await api.post<ApiResponse<FirebaseTokenResponse>>(
      '/api/v1/firebase-tokens',
      request
    );

    return response;
  } catch (error) {
    console.error('Error registering Firebase token:', error);

    // Log chi tiết lỗi
    if (error && typeof error === 'object') {
      if ('response' in error) {
        // Axios error
        const axiosError = error as AxiosErrorResponse;
        console.error('API error response:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });
      } else if ('message' in error) {
        console.error('Error message:', (error as { message: string }).message);
      }
    }

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

// Lấy danh sách notification từ API mới
export const fetchNotificationsFromApi = async (pageIndex = 0, pageSize = 20) => {
  try {
    // api.get wrapper: api.get<T>(url: string, params?: QueryParams)
    const data = await api.get('/api/Notifications/notifications', { pageIndex, pageSize });
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return {
      success: false,
      message: 'Failed to fetch notifications',
      data: [],
      error: ['Request failed'],
    };
  }
};
