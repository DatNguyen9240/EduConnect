import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import Error from '@/pages/Error/Error';
import {
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  Users,
  Calendar,
  BarChart3,
  Utensils,
  Settings,
  BarChart,
} from 'lucide-react';

// Lazy load components - chỉ tải khi cần thiết
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Register = lazy(() => import('@/pages/Auth/Register'));
const SoDauBai = lazy(() => import('@/pages/SoDauBai'));
const ThongKeBaoCao = lazy(() => import('@/pages/ThongKeBaoCao'));
const QuanLyHocTap = lazy(() => import('@/pages/QuanLyHocTap'));
const HocSinh = lazy(() => import('@/pages/HocSinh'));
const QuanTriThongTin = lazy(() => import('@/pages/QuanTriThongTin'));

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
        {
          path: 'so-dau-bai',
          element: <SoDauBai />,
        },
        {
          path: 'thong-ke-bao-cao',
          element: <ThongKeBaoCao />,
        },
        {
          path: 'quan-ly-hoc-tap',
          element: <QuanLyHocTap />,
        },
        {
          path: 'hoc-sinh',
          element: <HocSinh />,
        },
        {
          path: 'quan-tri-thong-tin',
          element: <QuanTriThongTin />,
        },
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

export const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/', active: false },
  { icon: MessageSquare, label: 'Chat', path: '/chat', active: false },
  { icon: BarChart, label: 'Thống kê', path: '/thong-ke-bao-cao', badge: '35', active: false },
  { icon: Users, label: 'Teacher', path: '/giao-vien', active: false },
  { icon: Calendar, label: 'Event', path: '/su-kien', active: true },
  { icon: BarChart3, label: 'Finance', path: '/tai-chinh', active: false },
  { icon: Utensils, label: 'Food', path: '/thuc-don', badge: '1', active: false },
  { icon: Settings, label: 'Settings', path: '/cai-dat', active: false },
];
