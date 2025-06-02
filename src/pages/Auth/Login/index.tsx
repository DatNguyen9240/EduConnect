import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 100);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Left Panel with Banner */}
      <div className="w-1/2 flex items-center justify-center bg-[#2962FF] rounded-r-[50px] p-10">
        <div className="max-w-md w-full bg-white rounded-[30px] p-6 shadow-xl text-center">
          <img
            src="/assets/banner/bannerLogin.png" // Ensure this image is available in public/assets/banner/
            alt="Login Banner"
            className="w-full object-contain rounded-[24px] mb-6 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-[#2962FF] mb-2">
            Welcome back to Edufactory!
          </h2>
          <p className="text-sm text-gray-600">
            Log in to explore personalized learning, expert instructors, and career-boosting content.
          </p>
        </div>
      </div>

      {/* Right Panel with Login Form */}
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
            Sign in to your account
          </h2>

          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="example@edufactory.com"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm"
                placeholder="********"
              />
              <div className="text-right mt-1 text-sm text-[#2962FF] hover:underline cursor-pointer">
                Forgot Password?
              </div>
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="mr-2 accent-[#2962FF] rounded"
              />
              <span className="text-sm text-gray-700">Keep me logged in</span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2962FF] text-white py-2 rounded-[16px] font-semibold hover:bg-[#1e4ddf] transition duration-300 shadow-md"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
