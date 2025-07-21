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

// Lưu thông tin đăng nhập (chỉ khi người dùng đồng ý "Ghi nhớ đăng nhập")
export const saveLoginInfo = (email: string, password: string, rememberMe: boolean) => {
  if (rememberMe) {
    // Lưu email dưới dạng plain text
    localStorage.setItem('auth_email', email);
    // Mã hóa mật khẩu đơn giản (không an toàn cho production, chỉ để demo)
    // Trong thực tế, bạn nên sử dụng phương pháp mã hóa an toàn hơn
    const encodedPassword = btoa(password);
    localStorage.setItem('auth_password', encodedPassword);
  } else {
    // Nếu không ghi nhớ, xóa thông tin đăng nhập cũ
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_password');
  }
};

// Lấy email đã lưu
export const getEmailFromLS = (): string => {
  return localStorage.getItem('auth_email') || '';
};

// Lấy password đã lưu
export const getPasswordFromLS = (): string => {
  const encodedPassword = localStorage.getItem('auth_password');
  if (!encodedPassword) return '';
  // Giải mã password
  return atob(encodedPassword);
};

export const clearLS = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('profile');
  // Không xóa thông tin đăng nhập để có thể silent login sau này
  // Nếu muốn đăng xuất hoàn toàn, sử dụng clearAllLS
};

// Xóa tất cả thông tin đăng nhập
export const clearAllLS = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('profile');
  localStorage.removeItem('auth_email');
  localStorage.removeItem('auth_password');
};
