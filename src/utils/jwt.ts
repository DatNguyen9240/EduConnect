import { jwtDecode } from 'jwt-decode';

// Định nghĩa interface cho JWT payload
export interface JwtPayload {
  // Standard JWT claims
  iss?: string; // issuer
  sub?: string; // subject
  aud?: string | string[]; // audience
  exp?: number; // expiration time
  nbf?: number; // not before
  iat?: number; // issued at
  jti?: string; // JWT ID

  // Custom claims
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string; // Account ID
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string; // Username
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string; // Email
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[]; // Roles

  // Fallback claims (nếu server sử dụng tên khác)
  accountId?: string;
  userId?: string;
  user_id?: string;
  id?: string;
  email?: string;
  username?: string;
  roles?: string | string[];
}

// Function để decode token và lấy account ID
export const getAccountIdFromToken = (token: string): string => {
  if (!token) {
    console.warn('Token is empty or null');
    return '';
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Thử các key khác nhau để lấy account ID
    const accountId =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      decoded.accountId ||
      decoded.userId ||
      decoded.user_id ||
      decoded.id ||
      decoded.sub; // JWT standard subject claim

    if (!accountId) {
      console.warn('Account ID not found in token payload:', decoded);
      return '';
    }

    return String(accountId);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return '';
  }
};

// Function để lấy tất cả thông tin từ token
export const getTokenInfo = (token: string): JwtPayload | null => {
  if (!token) {
    console.warn('Token is empty or null');
    return null;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

// Function để lấy email từ token
export const getEmailFromToken = (token: string): string => {
  if (!token) return '';

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const email =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      decoded.email;

    return email || '';
  } catch (error) {
    console.error('Error getting email from token:', error);
    return '';
  }
};

// Function để lấy username từ token
export const getUsernameFromToken = (token: string): string => {
  if (!token) return '';

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const username =
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.username;

    return username || '';
  } catch (error) {
    console.error('Error getting username from token:', error);
    return '';
  }
};

// Function để lấy roles từ token
export const getRolesFromToken = (token: string): string[] => {
  if (!token) return [];

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const roles =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || decoded.roles;

    if (!roles) return [];

    // Xử lý cả string và array
    if (Array.isArray(roles)) {
      return roles;
    }

    if (typeof roles === 'string') {
      // Nếu roles là string, split theo dấu phẩy
      return roles.split(',').map((role) => role.trim());
    }

    return [];
  } catch (error) {
    console.error('Error getting roles from token:', error);
    return [];
  }
};

// Function để check token expiration
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      console.warn('Token has no expiration time');
      return true;
    }

    const currentTime = Date.now() / 1000;
    return currentTime > decoded.exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Function để lấy thời gian hết hạn của token
export const getTokenExpirationTime = (token: string): Date | null => {
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
};

// Function để check xem token có sắp hết hạn không (trong vòng 5 phút)
export const isTokenExpiringSoon = (token: string, minutesBeforeExpiry: number = 5): boolean => {
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true;
    }

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;

    return minutesUntilExpiry <= minutesBeforeExpiry;
  } catch (error) {
    console.error('Error checking if token is expiring soon:', error);
    return true;
  }
};

// Function để debug token (chỉ dùng trong development)
export const debugToken = (token: string): void => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('debugToken should only be used in development');
    return;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log('🔍 Token Debug Info:');
    console.log('Full payload:', decoded);
    console.log('Account ID:', getAccountIdFromToken(token));
    console.log('Email:', getEmailFromToken(token));
    console.log('Username:', getUsernameFromToken(token));
    console.log('Roles:', getRolesFromToken(token));
    console.log('Expiration:', getTokenExpirationTime(token));
    console.log('Is expired:', isTokenExpired(token));
    console.log('Is expiring soon:', isTokenExpiringSoon(token));
  } catch (error) {
    console.error('Error debugging token:', error);
  }
};
