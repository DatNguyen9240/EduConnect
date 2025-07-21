import { useContext, useEffect } from 'react';
import { AppContext } from '@/contexts/app.context';
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/utils/auth';
import axiosInstance from '@/lib/axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useSilentLogin = () => {
  const { setIsAuthenticated, setUserInfo, isAuthenticated } = useContext(AppContext);

  const silentLogin = async () => {
    try {
      // Kiểm tra xem có token trong localStorage không
      const token = getAccessTokenFromLS();
      const refreshToken = getRefreshTokenFromLS();

      if (!token || !refreshToken) {
        console.log('No tokens found in localStorage');
        return;
      }

      // Thử gọi API để lấy thông tin người dùng
      try {
        // Gọi API để kiểm tra token và lấy thông tin user
        const response: any = await axiosInstance.post('/api/v1/auth/refresh-token', {
          refreshToken,
        });

        if (response.success) {
          console.log('Silent login successful');

          // Lưu token mới vào localStorage
          localStorage.setItem('access_token', response.data.token);
          localStorage.setItem('refresh_token', response.data.refreshToken);

          // Lấy thông tin user từ API
          try {
            const userResponse: any = await axiosInstance.get('/api/v1/auth/users/role');

            if (userResponse.success) {
              // Lưu thông tin user vào context và localStorage
              const userData = userResponse.data;
              setUserInfo(userData);
              localStorage.setItem('profile', JSON.stringify(userData));
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
        }
      } catch (error) {
        console.error('Silent login failed:', error);
        // Xóa token nếu refresh token không hợp lệ
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('profile');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error in silent login:', error);
    }
  };

  const logout = () => {
    // Xóa token và thông tin người dùng
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('profile');

    // Xóa thông tin đăng ký FCM token
    localStorage.removeItem('educonnect_fcm_token_registered');
    localStorage.removeItem('educonnect_fcm_token');

    setIsAuthenticated(false);

    // Thay vì sử dụng navigate, chuyển hướng bằng window.location
    window.location.href = '/login';
  };

  useEffect(() => {
    if (!isAuthenticated) {
      silentLogin();
    }
  }, []);

  return { silentLogin, logout };
};

export default useSilentLogin;
