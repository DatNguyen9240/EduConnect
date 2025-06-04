import { Link } from 'react-router-dom';
import { useShowForm } from '@/hooks/useLoginForm';
import { useRegisterForm } from '@hooks/useRegisterForm';
import { ROUTES } from '@constants/routes';
import { ASSETS } from '@constants/assets';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';

export default function Register() {
  const showForm = useShowForm();
  const { formData, handleChange, handleSubmit } = useRegisterForm();

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="fullName"
              name="fullName"
              type="text"
              label="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              required
            />

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
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
