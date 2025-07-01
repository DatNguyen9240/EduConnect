export const setAccessTokenToLS = (token: string | undefined | null) => {
  if (token && token !== 'undefined') {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const setRefreshTokenToLS = (refreshToken: string | undefined | null) => {
  if (refreshToken && refreshToken !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

export const getAccessTokenFromLS = (): string => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') return '';
  return token;
};

export const getRefreshTokenFromLS = (): string => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken === 'undefined') return '';
  return refreshToken;
};

export const clearLS = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('profile');
};
