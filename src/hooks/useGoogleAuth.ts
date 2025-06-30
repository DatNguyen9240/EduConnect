import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@constants/routes';
import type { GoogleUser } from '@/types';
import { setAccessTokenToLS, setRefreshTokenToLS } from '@/utils/auth';
import { AppContext } from '@/contexts/app.context';

interface GoogleLoginApiResponse {
  token: string;
  refreshToken: string;
  [key: string]: unknown;
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AppContext);

  const handleGoogleSuccess = async (user: GoogleUser, apiResponse?: GoogleLoginApiResponse) => {
    setIsLoading(true);
    try {
      // Log only essential user information
      console.log('Google user info:', {
        email: user.email,
        name: user.name,
        picture: user.picture,
        googleId: user.sub,
        givenName: user.given_name,
        familyName: user.family_name,
      });

      // Nếu có response từ backend (token, refreshToken) ở root
      console.log('[GoogleAuth] API response:', apiResponse);
      if (apiResponse && apiResponse.token) {
        console.log(
          '[GoogleAuth] Sử dụng setAccessTokenToLS và setRefreshTokenToLS từ utils/auth.ts'
        );
        setAccessTokenToLS(apiResponse.token);
        setRefreshTokenToLS(apiResponse.refreshToken || '');
        setIsAuthenticated(true);
        // Kiểm tra lại localStorage ngay sau khi lưu
        const tokenInLS = localStorage.getItem('token');
        const refreshTokenInLS = localStorage.getItem('refreshToken');
        console.log('[GoogleAuth] Đã lưu token vào localStorage:', {
          token: tokenInLS,
          refreshToken: refreshTokenInLS,
        });
        toast.success(`Welcome back, ${user.name}!`);
        navigate(ROUTES.HOME);
      } else {
        // Nếu không có response, chỉ toast như cũ
        toast.success(`Welcome back, ${user.name}!`);
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      toast.error('Failed to authenticate with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: unknown) => {
    console.error('Google authentication error:', error);
    toast.error('Google authentication failed. Please try again.');
    setIsLoading(false);
  };

  return {
    handleGoogleSuccess,
    handleGoogleError,
    isLoading,
  };
};
