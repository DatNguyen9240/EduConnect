import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@constants/routes';
import type { GoogleUser } from '@/types';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (user: GoogleUser) => {
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

      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Error during Google authentication:', error);
      toast.error('Failed to authenticate with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error: any) => {
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
