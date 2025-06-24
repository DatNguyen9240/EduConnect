export const GENDER_OPTIONS = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
] as const;

export const GRADE_OPTIONS = [
  { value: 10, label: 'Khối 10' },
  { value: 11, label: 'Khối 11' },
  { value: 12, label: 'Khối 12' },
] as const;

export const SECTION_OPTIONS = [
  { value: 'A', label: 'Ban A' },
  { value: 'B', label: 'Ban B' },
  { value: 'C', label: 'Ban C' },
  { value: 'D', label: 'Ban D' },
] as const;

export const STUDENT_ID_PREFIX = 'HS';
export const PARENT_ID_PREFIX = 'PH';
export const CLASS_ID_PREFIX = '';

export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  INVALID_EMAIL: 'Email không hợp lệ',
  INVALID_PHONE: 'Số điện thoại không hợp lệ',
  DUPLICATE_STUDENT_ID: 'Mã học sinh đã tồn tại',
} as const;

export const SUCCESS_MESSAGES = {
  ADD_STUDENT: 'Thêm học sinh mới thành công',
  UPDATE_STUDENT: 'Cập nhật thông tin học sinh thành công',
  DELETE_STUDENT: 'Xóa học sinh thành công',
} as const;
