import api from '@/lib/axios';
import type { AuthLoginResponse, AuthResponse } from '@/types/auth.type';
import type { GoogleUser } from '@/types/auth';

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

// Google Login API
export const googleLogin = (googleUser: GoogleUser) => {
  // Map GoogleUser to backend expected payload
  const payload = {
    googleId: googleUser.sub,
    email: googleUser.email,
    name: googleUser.name,
    givenName: googleUser.given_name,
    familyName: googleUser.family_name,
    picture: googleUser.picture,
    emailVerified: googleUser.email_verified,
  };
  return api.post<AuthLoginResponse>('/api/Auth/google-login', payload);
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
    'https://educonnectswd-buh0fbdfabcqfehm.australiaeast-01.azurewebsites.net/api/Auth/user-role-id'
  );
};
