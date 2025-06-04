import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import Error from '@/pages/Error/Error';
import ProfileScreen from '@/pages/Auth/Profile';

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
        {
          path: 'proflie',
          element: <ProfileScreen />,
        },
      ],
    },
  ]);
};
