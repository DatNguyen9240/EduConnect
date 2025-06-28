import type { SuccessResponse } from './utils.type';

export type AuthResponse = SuccessResponse<{
  email: string;
  firstName: string;
  lastName: string;
}>;

export type AuthLoginResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
  };
  error?: string[];
};

export type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
  } | null;
  error?: string[];
};
