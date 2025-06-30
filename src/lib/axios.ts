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
import { getAccountIdFromToken, isTokenExpired } from '@/utils/jwt';
import { isAxiosUnauthorizedError } from '@/utils/utils';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { toast } from 'react-toastify';

//
let accessToken = getAccessTokenFromLS();
let refreshToken = getRefreshTokenFromLS();
let refreshTokenRequest: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào request
axiosInstance.interceptors.request.use(
  async (config) => {
    if (
      accessToken &&
      isTokenExpired(accessToken) &&
      config.url !== URL_REFRESH_TOKEN &&
      config.url !== URL_LOGIN
    ) {
      if (!refreshTokenRequest) {
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
  (error) => Promise.reject(error)
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
    } else if (url === '/api/Auth/logout') {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any | undefined = error.response?.data;
      const message = data.message || error.message;
      toast.error(message);
    }

    if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
      const config = error.response?.config;
      const url = config?.url || '';

      if (url === URL_REFRESH_TOKEN) {
        clearLS();
        toast.error('Session expired, please login again.');
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
          clearLS();
          toast.error('Session expired, please login again.');
        }
      } else {
        clearLS();
        toast.error('Session expired, please login again.');
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
      const { token: newToken, refreshToken: newRefreshToken } = response.data.data;
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

  delete: async <T>(url: string) => {
    const response = await axiosInstance.delete<T>(url);
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
