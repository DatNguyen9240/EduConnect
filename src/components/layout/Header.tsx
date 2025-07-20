import { Link } from 'react-router-dom';
import { settingsMenu } from '@/constants/routes';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearLS } from '@/utils/auth';
import { AppContext } from '@/contexts/app.context';
import NotificationSettings from '@/components/NotificationSettings';

interface Profile {
  avatarUrl?: string;
  lastName?: string;
  fullName?: string;
  [key: string]: unknown;
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserInfo } = useContext(AppContext);

  const handleLogout = () => {
    clearLS();
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/');
  };

  // Lấy profile từ localStorage
  let profile: Profile = {};
  try {
    profile = JSON.parse(localStorage.getItem('profile') || '{}') as Profile;
  } catch {
    // ignore
  }

  // Ưu tiên lấy avatar và tên từ context userInfo (profile)
  const avatarUrl = profile.avatarUrl || '/assets/avatar/default.jpg';

  const displayName = profile.fullName || profile.lastName || 'Người dùng';

  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center justify-between max-w-screen-xl w-full mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/assets/logo/logo.png" alt="Edu Connect Logo" className="h-8 mr-2" />
          <span className="text-blue-600 text-xl font-baloo font-bold">Edu Connect</span>
        </div>

        {/* Search Bar */}
        <div className="flex items-center border rounded-full px-4 py-2 flex-grow mx-4 max-w-md">
          <input type="text" placeholder="Tìm kiếm..." className="outline-none flex-grow" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* User Info and Settings */}
        <div className="flex items-center">
          {/* Notification Settings */}
          <NotificationSettings className="mr-2" />

          {/* User Info */}
          <div className="flex items-center mr-4">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="h-8 w-8 rounded-full mr-2 object-cover border border-gray-200"
              style={{ objectFit: 'cover', aspectRatio: '1/1', background: '#fff' }}
            />
            <span className="text-gray-700">{displayName}</span>
          </div>

          {/* Settings Dropdown */}
          <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="outline-none pt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 text-gray-500 cursor-pointer transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                <Link
                  to={settingsMenu.profile.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {settingsMenu.profile.label}
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  {settingsMenu.signOut.label}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
