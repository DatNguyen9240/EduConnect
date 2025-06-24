import apiConfig from '@/constants/apiConfig';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để gắn token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor để xử lý lỗi 401 Unauthorized
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       // Dispatch logout
//       store.dispatch(logout());

//       // Xóa token khỏi localStorage
//       localStorage.removeItem('accessToken');

//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   }
// );

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

export default axiosInstance;
export { api };
