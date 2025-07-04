import { useMemo } from 'react';
import { getAccessTokenFromLS } from '@/utils/auth';
import {
  getAccountIdFromToken,
  getEmailFromToken,
  getUsernameFromToken,
  getRolesFromToken,
  getTokenInfo,
  isTokenExpired,
  isTokenExpiringSoon,
  getTokenExpirationTime,
  debugToken,
  type JwtPayload,
} from '@/utils/jwt';

export interface TokenInfo {
  accountId: string;
  email: string;
  username: string;
  roles: string[];
  isExpired: boolean;
  isExpiringSoon: boolean;
  expirationTime: Date | null;
  fullPayload: JwtPayload | null;
}

export const useToken = () => {
  const token = getAccessTokenFromLS();

  const tokenInfo = useMemo((): TokenInfo => {
    if (!token) {
      return {
        accountId: '',
        email: '',
        username: '',
        roles: [],
        isExpired: true,
        isExpiringSoon: true,
        expirationTime: null,
        fullPayload: null,
      };
    }

    return {
      accountId: getAccountIdFromToken(token),
      email: getEmailFromToken(token),
      username: getUsernameFromToken(token),
      roles: getRolesFromToken(token),
      isExpired: isTokenExpired(token),
      isExpiringSoon: isTokenExpiringSoon(token),
      expirationTime: getTokenExpirationTime(token),
      fullPayload: getTokenInfo(token),
    };
  }, [token]);

  // Helper functions
  const hasRole = (role: string): boolean => {
    return tokenInfo.roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some((role) => tokenInfo.roles.includes(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every((role) => tokenInfo.roles.includes(role));
  };

  const isAdmin = (): boolean => {
    return hasRole('Principal') || hasRole('principal');
  };

  const isTeacher = (): boolean => {
    return hasRole('Teacher') || hasRole('teacher');
  };

  const isStudent = (): boolean => {
    return hasRole('Student') || hasRole('student');
  };

  const isParent = (): boolean => {
    return hasRole('Parent') || hasRole('parent');
  };

  // Debug function (only in development)
  const debug = () => {
    if (process.env.NODE_ENV === 'development') {
      debugToken(token);
    }
  };

  return {
    token,
    ...tokenInfo,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    debug,
  };
};
