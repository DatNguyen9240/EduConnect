import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setTimeout(() => setShowForm(true), 100);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Left Panel with Banner */}
      <div className="w-1/2 flex items-center justify-center bg-[#2962FF] rounded-r-[50px] p-10">
        <div className="max-w-md w-full bg-white rounded-[30px] p-6 shadow-xl text-center">
          <img
            src="/assets/banner/bannerRegister.png" // Ensure this exists
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
            showForm ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Logo */}
          <img
            src="/assets/logo/logo.png"
            alt="Edufactory Logo"
            className="mx-auto mb-6"
            width={64}
            height={64}
          />

          <h2 className="text-2xl font-bold text-[#1e2b4f] mb-6 text-center">
            Create your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-[16px] border border-gray-300 focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-[16px] border border-gray-300 focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-[16px] border border-gray-300 focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="********"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-[16px] border border-gray-300 focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2962FF] text-white py-2 rounded-[16px] font-semibold hover:bg-[#1e4ddf] transition duration-300 shadow-md"
            >
              Đăng ký
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
