import api from '@/lib/axios';
import type { AuthLoginResponse, AuthResponse } from '@/types/auth.type';

export const URL_LOGIN = '/api/Auth/login';
export const URL_REGISTER = '/api/Auth/register';
export const URL_REFRESH_TOKEN = '/api/Auth/new-token';

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
