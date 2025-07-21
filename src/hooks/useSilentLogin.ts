import { useContext, useState } from 'react';
import { AppContext } from '@/contexts/app.context';
import { loginAccount } from '@/api/auth.api';
import { getEmailFromLS, getPasswordFromLS } from '@/utils/auth';
import { axiosInstance } from '@/lib/axios';

/**
 * Hook để thực hiện silent login khi refresh token thất bại
 * Chỉ hoạt động nếu người dùng đã lưu thông tin đăng nhập
 */
export const useSilentLogin = () => {
  const { setIsAuthenticated, setUserInfo } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);

  const silentLogin = async (): Promise<boolean> => {
    const email = getEmailFromLS();
    const password = getPasswordFromLS();

    // Nếu không có thông tin đăng nhập được lưu, không thể silent login
    if (!email || !password) {
      console.log('Không thể silent login: Không có thông tin đăng nhập được lưu');
      return false;
    }

    setIsLoading(true);
    try {
      console.log('Đang thực hiện silent login...');
      const response = await loginAccount({ email, password });

      if (response.success) {
        // Lưu token vào localStorage
        // Lấy thông tin user
        try {
          // Gọi API lấy thông tin user
          const userInfoResponse = await axiosInstance.get('/api/v1/auth/users/role');

          if (userInfoResponse.data.success) {
            const userInfo = {
              userId: userInfoResponse.data.data.userId || '',
              role: userInfoResponse.data.data.role || '',
              id: userInfoResponse.data.data.id || '',
              fullName: userInfoResponse.data.data.fullName || '',
            };

            setUserInfo(userInfo);
            localStorage.setItem('profile', JSON.stringify(userInfo));
          }
        } catch (error) {
          console.error('Lỗi khi lấy thông tin user sau silent login:', error);
        }

        setIsAuthenticated(true);
        console.log('Silent login thành công');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Silent login thất bại:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    silentLogin,
    isLoading,
  };
};

export default useSilentLogin;
