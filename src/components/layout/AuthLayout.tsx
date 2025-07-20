import { Outlet } from 'react-router-dom';
import useNotificationNavigation from '@/hooks/useNotificationNavigation';

export default function AuthLayout() {
  // Kích hoạt hook để xử lý điều hướng thông báo
  useNotificationNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
