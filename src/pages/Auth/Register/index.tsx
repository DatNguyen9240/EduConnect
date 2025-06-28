import { Link, useNavigate } from 'react-router-dom';
import { useShowForm } from '@/hooks/useLoginForm';
// import { useRegisterForm } from '@hooks/useRegisterForm';
import { ROUTES } from '@constants/routes';
import { ASSETS } from '@constants/assets';
import { Button } from '@components/common/Button';
import { useForm } from 'react-hook-form';
import { schema, type Schema } from '@/utils/rules';
import InputComponent from '@/components/common/Input/InputComponent';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { registerAccount } from '@/api/auth.api';
import { isAxiosBadRequestError } from '@/utils/utils';
import type { ErrorResponse } from '@/types/utils.type';

type FormData = Schema;

export default function Register() {
  const showForm = useShowForm();
  // const { formData, handleChange, handleSubmit } = useRegisterForm();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: FormData) => registerAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    registerAccountMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login');
      },
      onError: (error) => {
        if (isAxiosBadRequestError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.error;
          if (formError) {
            setError('email', {
              message: formError[0],
              type: 'Server',
            });
          }
        }
      },
    });
  });

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Left Panel with Banner */}
      <div className="w-1/2 flex items-center justify-center bg-[#2962FF] rounded-r-[50px] p-10">
        <div className="max-w-md w-full bg-white rounded-[30px] p-6 shadow-xl text-center">
          <img
            src={ASSETS.BANNER.REGISTER}
            alt="Register Banner"
            className="w-full object-contain rounded-[24px] mb-6 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-[#2962FF] mb-2">
            Start Your Journey with Edufactory
          </h2>
          <p className="text-sm text-gray-600">
            Learn new skills, connect with mentors, and unlock your potential.
          </p>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div
          className={`bg-white p-10 rounded-[30px] shadow-xl w-full max-w-sm transition-all duration-500 transform ${
            showForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {/* Logo */}
          <img
            src={ASSETS.LOGO.MAIN}
            alt="Edufactory Logo"
            className="mx-auto mb-6"
            width={64}
            height={64}
          />

          <h2 className="text-2xl font-bold text-[#1e2b4f] mb-6 text-center">
            Create your account
          </h2>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <InputComponent
              id="firstName"
              name="firstName"
              type="text"
              label="Tên"
              placeholder="An"
              register={register}
              errorMessage={errors.firstName?.message}
            />

            <InputComponent
              id="lastName"
              name="lastName"
              type="text"
              label="Họ"
              placeholder="Nguyễn Văn"
              register={register}
              errorMessage={errors.lastName?.message}
            />

            <InputComponent
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="example@email.com"
              register={register}
              errorMessage={errors.email?.message}
            />

            <InputComponent
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="********"
              register={register}
              errorMessage={errors.password?.message}
              autoComplete="on"
            />

            <InputComponent
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="********"
              register={register}
              errorMessage={errors.confirmPassword?.message}
              autoComplete="on"
            />

            <Button type="submit" fullWidth size="lg">
              Đăng ký
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{' '}
            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
