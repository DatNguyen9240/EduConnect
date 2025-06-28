import { jwtDecode } from 'jwt-decode';

export const getAccountIdFromToken = (token: string): string => {
  try {
    // Định nghĩa kiểu rõ ràng cho decoded
    type JwtPayload = { [key: string]: unknown };
    const decoded = jwtDecode<JwtPayload>(token);
    const accountId =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    return typeof accountId === 'string' ? accountId : '';
  } catch (error) {
    return 'Lỗi decode: ' + (error instanceof Error ? error.message : String(error));
  }
};

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
};
