// Các constants khác có thể dùng chung
export const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự',
} as const;

export const UI_MESSAGES = {
  LOADING: 'Đang tải...',
  NO_DATA: 'Không có dữ liệu',
  UPDATE_SUCCESS: 'Cập nhật thành công',
  UPDATE_ERROR: 'Cập nhật thất bại',
} as const;
