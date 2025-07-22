import { getAccessTokenFromLS } from '@/utils/auth';
import { createContext, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Sửa interface UserInfo cho đúng backend
export interface UserInfo {
  userId: string;
  role: string;
  id: string;
  fullName: string;
}

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  // Helper functions
  hasRole: (role: string) => boolean;
  isParent: () => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  userInfo: null,
  setUserInfo: () => null,
  hasRole: () => false,
  isParent: () => false,
  isStudent: () => false,
  isTeacher: () => false,
  isAdmin: () => false,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
    const profile = localStorage.getItem('profile');
    return profile ? JSON.parse(profile) : null;
  });
  const queryClient = useQueryClient();

  // Khi logout hoặc refreshToken hết hạn thì clear toàn bộ cache
  useEffect(() => {
    if (!isAuthenticated) {
      setUserInfo(null);
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient]);

  // Khi userInfo thay đổi (login/logout/chuyển account), clear cache notification
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['notifications'] });
  }, [userInfo?.id, queryClient]);

  // Helper functions
  const hasRole = (role: string): boolean => {
    return userInfo?.role === role;
  };
  const isParent = () => hasRole('Parent');
  const isStudent = () => hasRole('Student');
  const isTeacher = () => hasRole('Teacher');
  const isAdmin = () => hasRole('Admin');

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userInfo,
        setUserInfo,
        hasRole,
        isParent,
        isStudent,
        isTeacher,
        isAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
