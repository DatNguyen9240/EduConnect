import type { RegisterOptions, UseFormGetValues } from 'react-hook-form';
import * as yup from 'yup';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type Rules = { [key in keyof FormData]?: RegisterOptions<FormData, key> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  firstName: {
    required: {
      value: true,
      message: 'Tên là bắt buộc',
    },
    minLength: {
      value: 2,
      message: 'Tên phải có ít nhất 2 ký tự',
    },
    maxLength: {
      value: 50,
      message: 'Tên không được vượt quá 50 ký tự',
    },
    pattern: {
      value: /^[A-Za-zÀ-Ỵà-ỵ\s'-]+$/,
      message: 'Tên chỉ được chứa chữ cái',
    },
  },
  lastName: {
    required: {
      value: true,
      message: 'Họ là bắt buộc',
    },
    minLength: {
      value: 2,
      message: 'Họ phải có ít nhất 2 ký tự',
    },
    maxLength: {
      value: 50,
      message: 'Họ không được vượt quá 50 ký tự',
    },
    pattern: {
      value: /^[A-Za-zÀ-Ỵà-ỵ\s'-]+$/,
      message: 'Họ chỉ được chứa chữ cái',
    },
  },
  email: {
    required: {
      value: true,
      message: 'Email là bắt buộc',
    },
    pattern: {
      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Email không đúng định dạng',
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 5 - 160 ký tự',
    },
    minLength: {
      value: 5,
      message: 'Độ dài từ 5 - 160 ký tự',
    },
  },
  password: {
    required: {
      value: true,
      message: 'Password là bắt buộc',
    },
    validate: {
      hasUppercase: (value) => {
        return /[A-Z]/.test(value) || 'Password phải chứa ít nhất 1 chữ in hoa (A-Z).';
      },
      hasDigit: (value) => {
        return /\d/.test(value) || "Password phải chứa ít nhất 1 số ('0'-'9').";
      },
      hasSpecialChar: (value) => {
        return /[^a-zA-Z0-9]/.test(value) || 'Password phải chứa ít nhất 1 ký tự đặc biệt.';
      },
    },
    maxLength: {
      value: 160,
      message: 'Độ dài từ 8 - 160 ký tự',
    },
    minLength: {
      value: 8,
      message: 'Mật khẩu phải có ít nhất 8 ký tự',
    },
  },
  confirmPassword: {
    required: {
      value: true,
      message: 'Nhập lại password là bắt buộc',
    },

    maxLength: {
      value: 160,
      message: 'Độ dài từ 8 - 160 ký tự',
    },
    minLength: {
      value: 8,
      message: 'Mật khẩu phải có ít nhất 8 ký tự.',
    },
    validate:
      typeof getValues === 'function'
        ? (value) => {
            if (value === getValues('password')) {
              return true;
            }
            return 'Nhập lại mật khẩu không khớp';
          }
        : undefined,
  },
});

export const schema = yup.object({
  firstName: yup
    .string()
    .required('Tên là bắt buộc')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được vượt quá 50 ký tự')
    .matches(/^[A-Za-zÀ-Ỵà-ỵ\s'-]+$/, 'Tên chỉ được chứa chữ cái'),
  lastName: yup
    .string()
    .required('Họ là bắt buộc')
    .min(2, 'Họ phải có ít nhất 2 ký tự')
    .max(50, 'Họ không được vượt quá 50 ký tự')
    .matches(/^[A-Za-zÀ-Ỵà-ỵ\s'-]+$/, 'Họ chỉ được chứa chữ cái'),
  email: yup
    .string()
    .required('Tên là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(160, 'Độ dài từ 8 - 160 ký tự')
    .test('hasUppercase', 'Password phải chứa ít nhất 1 chữ in hoa (A-Z)', (value) =>
      /[A-Z]/.test(value)
    )
    .test('hasDigit', "Password phải chứa ít nhất 1 số ('0'-'9').", (value) => /\d/.test(value))
    .test('hasSpecialChar', 'Password phải chứa ít nhất 1 ký tự đặc biệt', (value) =>
      /[^a-zA-Z0-9]/.test(value)
    ),
  confirmPassword: yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(160, 'Độ dài từ 8 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không khớp'),
});

export type Schema = yup.InferType<typeof schema>;
export const loginSchema = schema.omit(['firstName', 'lastName', 'confirmPassword']);

// Định nghĩa kiểu LoginSchema từ loginSchema
export type LoginSchema = yup.InferType<typeof loginSchema>;
