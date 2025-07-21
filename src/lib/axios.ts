import { URL_LOGIN, URL_REFRESH_TOKEN } from '@/api/auth.api';
import apiConfig from '@/constants/apiConfig';
import type { AuthLoginResponse, RefreshTokenResponse } from '@/types/auth.type';
import type { ErrorResponse } from '@/types/utils.type';
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS,
} from '@/utils/auth';
import { getAccountIdFromToken, isTokenExpired, isTokenExpiringSoon } from '@/utils/jwt';
import { isAxiosUnauthorizedError } from '@/utils/utils';
import axios, { AxiosError, HttpStatusCode, type AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

//
let accessToken = getAccessTokenFromLS();
let refreshToken = getRefreshTokenFromLS();
let refreshTokenRequest: Promise<string> | null = null;
let isOnline = navigator.onLine;

let requestQueue: Array<{
  config: AxiosRequestConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (error: any) => void;
}> = [];
let silentLoginInProgress = false;

// Xử lý sự kiện online/offline
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

function handleOnline() {
  console.log('Kết nối mạng đã được khôi phục');
  isOnline = true;
  toast.success('Kết nối mạng đã được khôi phục');

  // Xử lý các request trong queue
  processQueue();
}

function handleOffline() {
  console.log('Mất kết nối mạng');
  isOnline = false;
  toast.warning('Mất kết nối mạng. Các yêu cầu sẽ được xử lý khi có kết nối trở lại.');
}

// Xử lý queue request khi có kết nối trở lại
async function processQueue() {
  if (requestQueue.length === 0) return;

  console.log(`Đang xử lý ${requestQueue.length} yêu cầu trong queue`);

  // Kiểm tra và refresh token nếu cần
  if (accessToken && (isTokenExpired(accessToken) || isTokenExpiringSoon(accessToken, 5))) {
    try {
      accessToken = await handleRefreshToken();
    } catch (error) {
      // Nếu refresh token thất bại, reject tất cả request trong queue
      console.error('Refresh token failed:', error);
      requestQueue.forEach((request) => {
        request.reject(new Error('Session expired, please login again.'));
      });
      requestQueue = [];
      return;
    }
  }

  // Xử lý từng request trong queue
  const queue = [...requestQueue];
  requestQueue = [];

  for (const request of queue) {
    try {
      // Cập nhật token mới vào header
      if (accessToken && request.config.headers) {
        request.config.headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await axiosInstance(request.config);
      request.resolve(response);
    } catch (error) {
      request.reject(error);
    }
  }
}

const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
});

// Thêm interceptor để gắn token vào request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Nếu offline và không phải request quan trọng (như refresh token), thêm vào queue
    if (!isOnline && config.url !== URL_REFRESH_TOKEN) {
      // Trả về một promise mới sẽ được resolve/reject khi có kết nối trở lại
      return new Promise((resolve, reject) => {
        console.log('Đang offline, thêm request vào queue:', config.url);
        requestQueue.push({ config, resolve, reject });
      });
    }

    if (
      accessToken &&
      (isTokenExpired(accessToken) || isTokenExpiringSoon(accessToken, 5)) &&
      config.url !== URL_REFRESH_TOKEN &&
      config.url !== URL_LOGIN
    ) {
      if (!refreshTokenRequest) {
        console.log('Token sắp hết hạn hoặc đã hết hạn, đang refresh token...');
        refreshTokenRequest = handleRefreshToken();
      }
      accessToken = await refreshTokenRequest;
      refreshTokenRequest = null;
    }
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  () => Promise.reject(new Error('Request error'))
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    const { url } = response.config;
    if (url === URL_LOGIN) {
      const data = response.data as AuthLoginResponse;
      accessToken = data.data.token;
      refreshToken = data.data.refreshToken;
      setAccessTokenToLS(accessToken);
      setRefreshTokenToLS(refreshToken);
    } else if (url === '/api/v1/auth/logout') {
      accessToken = '';
      refreshToken = '';
      clearLS();
    }
    return response;
  },
  async (error: AxiosError) => {
    // Log detailed error information
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers,
    });

    // Handle 404 errors without showing toast
    if (error.response?.status === HttpStatusCode.NotFound) {
      return Promise.reject(error);
    }

    if (error.response?.status !== HttpStatusCode.BadRequest) {
      const data = error.response?.data as
        | ErrorResponse<{ name: string; message: string }>
        | undefined;
      const message = data?.message || error.message;
      toast.error(message);
    }

    if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
      const config = error.response?.config;
      const url = config?.url || '';

      if (url === URL_REFRESH_TOKEN) {
        // Nếu refresh token thất bại, thử silent login
        if (!silentLoginInProgress) {
          silentLoginInProgress = true;

          // Thông báo cho người dùng
          toast.info('Đang thử kết nối lại...');

          // Gọi silent login thông qua event để tránh circular dependency
          const event = new CustomEvent('silent-login-required');
          window.dispatchEvent(event);

          // Đợi một khoảng thời gian để silent login có thể hoàn thành
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Kiểm tra xem token mới đã được cập nhật chưa
          const newToken = getAccessTokenFromLS();
          if (newToken && newToken !== accessToken) {
            accessToken = newToken;
            refreshToken = getRefreshTokenFromLS();

            // Nếu có config, thử lại request với token mới
            if (config) {
              silentLoginInProgress = false;
              config.headers = config.headers || {};
              config.headers.Authorization = `Bearer ${accessToken}`;
              return axiosInstance(config);
            }
          }

          silentLoginInProgress = false;
        }

        // Nếu silent login thất bại hoặc không có thông tin đăng nhập
        clearLS();
        toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
        window.location.href = '/';
        return Promise.reject(error);
      }

      if (refreshToken && accessToken) {
        try {
          refreshTokenRequest = refreshTokenRequest || handleRefreshToken();
          accessToken = await refreshTokenRequest;
          refreshTokenRequest = null;

          // Retry lại request với token mới
          if (config) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
            return axiosInstance(config);
          }
        } catch {
          // Nếu refresh token thất bại, thử silent login
          if (!silentLoginInProgress) {
            silentLoginInProgress = true;

            // Thông báo cho người dùng
            toast.info('Đang thử kết nối lại...');

            // Gọi silent login thông qua event để tránh circular dependency
            const event = new CustomEvent('silent-login-required');
            window.dispatchEvent(event);

            // Đợi một khoảng thời gian để silent login có thể hoàn thành
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Kiểm tra xem token mới đã được cập nhật chưa
            const newToken = getAccessTokenFromLS();
            if (newToken && newToken !== accessToken) {
              accessToken = newToken;
              refreshToken = getRefreshTokenFromLS();

              // Nếu có config, thử lại request với token mới
              if (config) {
                silentLoginInProgress = false;
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(config);
              }
            }

            silentLoginInProgress = false;
          }

          clearLS();
          toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
          window.location.href = '/';
        }
      } else {
        clearLS();
        toast.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export async function handleRefreshToken(): Promise<string> {
  const token = getAccessTokenFromLS();
  const refresh = getRefreshTokenFromLS();
  const accountId = getAccountIdFromToken(token);

  if (!refresh || !accountId) {
    clearLS();
    throw new Error('No refreshToken or accountId found.');
  }

  try {
    const response = await axiosInstance.post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
      accountId,
      refreshToken: refresh,
    });

    if (response.data.success && response.data.data) {
      const newToken =
        (response.data.data as { accessToken?: string }).accessToken ||
        (response.data.data as { token?: string }).token ||
        '';
      const newRefreshToken = response.data.data.refreshToken || '';
      setAccessTokenToLS(newToken);
      setRefreshTokenToLS(newRefreshToken);

      accessToken = newToken;
      refreshToken = newRefreshToken;

      return newToken;
    } else {
      clearLS();
      throw new Error('Refresh token failed');
    }
  } catch (error) {
    clearLS();
    throw error;
  }
}

// Type for query parameters
type QueryParams = Record<string, string | number | boolean>;

// Type for request body
type RequestBody = Record<string, unknown>;

// Wrapper methods for common HTTP requests
const api = {
  get: async <T>(url: string, params?: QueryParams) => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },

  post: async <T>(url: string, data?: RequestBody) => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: RequestBody) => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },

  // Special method for form data POST requests
  postForm: async <T>(url: string, data: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      params.append(key, data[key]);
    });
    const response = await axiosInstance.post<T>(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export default api;
export { axiosInstance };
