import { Link, useNavigate } from 'react-router-dom';
import { useShowForm } from '@/hooks/useLoginForm';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { ROUTES } from '@constants/routes';
import { ASSETS } from '@constants/assets';
import { Button } from '@components/common/Button';
import { GoogleLogin } from '@components/common/GoogleLogin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, type LoginSchema } from '@/utils/rules';
import { useMutation } from '@tanstack/react-query';
import { loginAccount } from '@/api/auth.api';
import { isAxiosBadRequestError } from '@/utils/utils';
import type { ErrorResponse } from '@/types/utils.type';
import InputComponent from '@/components/common/Input/InputComponent';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';

type FormData = LoginSchema;

export default function Login() {
  const { setIsAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const showForm = useShowForm();
  const { handleGoogleSuccess, handleGoogleError, isLoading } = useGoogleAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
  });

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => loginAccount(body),
  });

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        setIsAuthenticated(true);
        navigate('/admin-dashboard');
      },
      onError: (error) => {
        console.log(error);
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
    <div className=" flex min-h-screen bg-[#f0f4ff]">
      {/* Left Panel with Banner */}
      <div className="w-1/2 flex items-center justify-center bg-[#2962FF] rounded-r-[50px] p-10">
        <div className="max-w-md w-full bg-white rounded-[30px] p-6 shadow-xl text-center">
          <img
            src={ASSETS.BANNER.LOGIN}
            alt="Login Banner"
            className="w-full object-contain rounded-[24px] mb-6 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-[#2962FF] mb-2">
            Welcome back to Edufactory!
          </h2>
          <p className="text-sm text-gray-600">
            Log in to explore personalized learning, expert instructors, and career-boosting
            content.
          </p>
        </div>
      </div>

      {/* Right Panel with Login Form */}
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
            Sign in to your account
          </h2>

          {/* Google Login Button */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="mb-4"
            >
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </GoogleLogin>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" noValidate>
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

            <div className="text-right mt-1 text-sm text-[#2962FF] hover:underline cursor-pointer">
              <Link to={ROUTES.FORGOT_PASSWORD}>Quên mật khẩu?</Link>
            </div>

            <div className="mb-4 flex items-center">
              <input type="checkbox" className="mr-2 accent-[#2962FF] rounded" />
              <span className="text-sm text-gray-700">Lưu đăng nhập</span>
            </div>

            <Button type="submit" fullWidth size="lg">
              Đăng nhập
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{' '}
            <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline font-medium">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
