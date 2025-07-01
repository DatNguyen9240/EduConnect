import { getAccessTokenFromLS } from '@/utils/auth';
import {
  getAccountIdFromToken,
  getEmailFromToken,
  getUsernameFromToken,
  getRolesFromToken,
} from '@/utils/jwt';
import { createContext, useState, useEffect } from 'react';
import { clearLS } from '@/utils/auth';

interface UserInfo {
  accountId: string;
  email: string;
  username: string;
  roles: string[];
}

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  // Helper functions
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  isParent: () => boolean;
}

const getInitialUserInfo = (): UserInfo | null => {
  const token = getAccessTokenFromLS();
  if (!token) return null;

  return {
    accountId: getAccountIdFromToken(token),
    email: getEmailFromToken(token),
    username: getUsernameFromToken(token),
    roles: getRolesFromToken(token),
  };
};

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  userInfo: getInitialUserInfo(),
  setUserInfo: () => null,
  hasRole: () => false,
  hasAnyRole: () => false,
  hasAllRoles: () => false,
  isAdmin: () => false,
  isTeacher: () => false,
  isStudent: () => false,
  isParent: () => false,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(initialAppContext.userInfo);

  // Check token validity on mount
  useEffect(() => {
    const token = getAccessTokenFromLS();
    const accountId = getAccountIdFromToken(token);
    if (token && !accountId) {
      clearLS();
      setIsAuthenticated(false);
      setUserInfo(null);
      window.location.href = '/';
    }
  }, []);

  // Update user info when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      const token = getAccessTokenFromLS();
      if (token) {
        setUserInfo({
          accountId: getAccountIdFromToken(token),
          email: getEmailFromToken(token),
          username: getUsernameFromToken(token),
          roles: getRolesFromToken(token),
        });
      }
    } else {
      setUserInfo(null);
    }
  }, [isAuthenticated]);

  // Helper functions
  const hasRole = (role: string): boolean => {
    return userInfo?.roles.includes(role) || false;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return userInfo?.roles.some((role) => roles.includes(role)) || false;
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return userInfo?.roles.every((role) => roles.includes(role)) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole('Admin') || hasRole('admin');
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

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfo,
        setUserInfo,
        hasRole,
        hasAnyRole,
        hasAllRoles,
        isAdmin,
        isTeacher,
        isStudent,
        isParent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
