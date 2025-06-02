import { useEffect, useState } from "react";

const Login = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 100); // Delay để tạo animation
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] transition-all duration-700">
      {/* Left Panel */}
      <div className="w-1/2 flex items-center justify-center p-10 bg-[#2962FF] rounded-r-[50px] transition-all duration-500">
        <div className="bg-white p-10 rounded-[30px] shadow-xl w-full max-w-md text-center animate-fade-in">
          <img
            src="/assets/banner/bannerLogin.png"
            alt="Student"
            className="w-full object-contain rounded-[24px] mb-6 shadow-md transition-all duration-500"
          />
          <h2 className="text-3xl font-extrabold text-[#2962FF] mb-3 leading-tight drop-shadow-sm">
            Unleash Your Potential with Edufactory
          </h2>
          <p className="text-sm text-gray-600">
            Turn your passions into skills, your ideas into action, and your
            future into something extraordinary.
          </p>
        </div>
      </div>

      {/* Right Panel */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#2962FF] bg-gray-50 transition duration-300"
                placeholder="example@edufactory.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#2962FF] bg-gray-50 transition duration-300"
                placeholder="********"
              />
              <div className="text-right mt-1 text-sm text-[#2962FF] hover:underline cursor-pointer transition">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
