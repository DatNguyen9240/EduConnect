import api from '@/lib/axios';
import type { AuthLoginResponse, AuthResponse } from '@/types/auth.type';

export const URL_LOGIN = '/api/v1/auth/login';
export const URL_REGISTER = '/api/v1/auth/register';
export const URL_REFRESH_TOKEN = '/api/v1/auth/token/refresh';

export const registerAccount = (body: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}) => {
  const updatedBody = {
    ...body,
    role: 0,
  };

  // Gửi request với body đã được bổ sung role
  return api.post<AuthResponse>(URL_REGISTER, updatedBody);
};

export const loginAccount = (body: { email: string; password: string }) => {
  // Gửi request với body đã được bổ sung role
  return api.post<AuthLoginResponse>(URL_LOGIN, body);
};

// Google Login API
export const googleLogin = (googleToken: string) => {
  return api.post<AuthLoginResponse>(
    'https://educonnectswd-buh0fbdfabcqfehm.australiaeast-01.azurewebsites.net/api/v1/auth/logins/google',
    { googleToken }
  );
};

export const getParentInfo = () => {
  return api.get<{
    success: boolean;
    message: string;
    data: {
      userId: string;
      role: string;
      id: string;
      fullName: string;
    };
    error: unknown;
  }>(
    'https://educonnectswd-buh0fbdfabcqfehm.australiaeast-01.azurewebsites.net/api/v1/auth/users/role'
  );
};
