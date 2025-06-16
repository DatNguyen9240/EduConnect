import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import Error from '@/pages/Error/Error';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  BarChart3,
  Utensils,
  Settings,
  BarChart,
} from 'lucide-react';
import LichThi from '@/pages/LichThi';

// Lazy load components - chỉ tải khi cần thiết
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Register = lazy(() => import('@/pages/Auth/Register'));
const SoDauBai = lazy(() => import('@/pages/SoDauBai'));
const ThongKeBaoCao = lazy(() => import('@/pages/ThongKeBaoCao'));
const QuanLyHocTap = lazy(() => import('@/pages/QuanLyHocTap'));
const HocSinh = lazy(() => import('@/pages/HocSinh'));
const QuanTriThongTin = lazy(() => import('@/pages/QuanTriThongTin'));
const AdminDashboard = lazy(() => import('@/components/admin-dashboard'));

export const routeMenuConfig = [
  {
    path: '/admin-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    element: <AdminDashboard />,
    showInMenu: true,
    badge: null,
  },
  {
    path: '/chat',
    label: 'Chat',
    icon: MessageSquare,
    element: <div>Chat page</div>,
    showInMenu: true,
    badge: null,
  },
  {
    path: '/thong-ke-bao-cao',
    label: 'Thống kê',
    icon: BarChart,
    element: <ThongKeBaoCao />,
    showInMenu: true,
    badge: '35',
  },
  {
    path: '/giao-vien',
    label: 'Teacher',
    icon: Users,
    element: <div>Teacher page</div>,
    showInMenu: true,
    badge: null,
  },
  {
    path: '/lich-thi',
    label: 'Lịch thi',
    icon: Calendar,
    element: <LichThi />,
    showInMenu: true,
    badge: null,
  },
  {
    path: '/tai-chinh',
    label: 'Finance',
    icon: BarChart3,
    element: <div>Finance page</div>,
    showInMenu: true,
    badge: null,
  },
  {
    path: '/thuc-don',
    label: 'Food',
    icon: Utensils,
    element: <div>Food page</div>,
    showInMenu: true,
    badge: '1',
  },
  {
    path: '/cai-dat',
    label: 'Settings',
    icon: Settings,
    element: <div>Settings page</div>,
    showInMenu: true,
    badge: null,
  },
  // Các route không show menu
  {
    path: '/',
    label: 'Home',
    icon: null,
    element: <Home />,
    showInMenu: false,
    badge: null,
  },
  {
    path: '/so-dau-bai',
    label: 'Sổ đầu bài',
    icon: null,
    element: <SoDauBai />,
    showInMenu: false,
    badge: null,
  },
  {
    path: '/quan-ly-hoc-tap',
    label: 'Quản lý học tập',
    icon: null,
    element: <QuanLyHocTap />,
    showInMenu: false,
    badge: null,
  },
  {
    path: '/hoc-sinh',
    label: 'Học sinh',
    icon: null,
    element: <HocSinh />,
    showInMenu: false,
    badge: null,
  },
  {
    path: '/quan-tri-thong-tin',
    label: 'Quản trị thông tin',
    icon: null,
    element: <QuanTriThongTin />,
    showInMenu: false,
    badge: null,
  },
];

export const RouterConfig = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <Error>Something went wrong</Error>,
      children: [
        {
          index: true,
          element: <Home />,
        },
        ...routeMenuConfig
          .filter((r) => r.path !== '/')
          .map((r) => ({ path: r.path.replace(/^\//, ''), element: r.element })),
      ],
    },
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
      ],
    },
  ]);
};
