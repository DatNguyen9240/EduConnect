import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
        Chào mừng đến với EduConnect
      </h1>
      <p className="text-lg text-gray-700 text-center max-w-xl mb-6">
        Nền tảng kết nối số thông minh giữa <strong>phụ huynh</strong>, <strong>giáo viên</strong>,
        <strong> học sinh</strong> và <strong>ban giám hiệu</strong>, giúp theo dõi và nâng cao chất
        lượng giáo dục trung học.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
          Đăng nhập
        </Link>
        <Link
          to="/register"
          className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
        >
          Đăng ký tài khoản
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-500">
        © 2025 FPT EduConnect – Powered by Group SWD392
      </div>
    </div>
  );
}
