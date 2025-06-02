import { useEffect, useState } from "react";

export default function Register() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowForm(true);
    }, 100);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      <div className="w-1/2 flex items-center justify-center bg-[#2962FF] rounded-r-[50px] p-10">
        <div className="max-w-md w-full bg-white rounded-[30px] p-6 shadow-xl text-center">
          <img
            src="/assets/banner/bannerRegister.png"
            alt="Register banner"
            className="w-full rounded-[24px] object-contain mb-6 shadow-lg"
          />
          <h2 className="text-2xl font-extrabold text-[#2962FF] mb-2">
            Join Edufactory Today
          </h2>
          <p className="text-sm text-gray-600">
            Unleash your creativity, learn new skills, and reach your full
            potential with us.
          </p>
        </div>
      </div>

      {/* Right side: Register form */}
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

          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50"
                placeholder="Nguyen Van A"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50"
                placeholder="your@email.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2962FF] text-white py-2 rounded-[16px] font-semibold hover:bg-[#1e4ddf] transition duration-300 shadow-md"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
