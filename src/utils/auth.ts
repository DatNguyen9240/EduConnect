export const setAccessTokenToLS = (token: string) => {
  localStorage.setItem('token', token);
};

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessTokenFromLS = (): string => {
  return localStorage.getItem('token') || '';
};

export const getRefreshTokenFromLS = (): string => {
  return localStorage.getItem('refreshToken') || '';
};

export const clearLS = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('profile');
};
