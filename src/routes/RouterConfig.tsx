import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import Error from "@/pages/Error/Error";
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType } from "react";

// Define a type for the Navbar item configuration
interface NavbarItemConfig {
  path: string;
  text: string;
  icon: ComponentType<any>;
  hasDropdown?: boolean;
}

// Define the array of Navbar items
export const navbarItems: NavbarItemConfig[] = [
  {
    path: "/",
    text: "Trang chủ",
    icon: HomeIcon,
    hasDropdown: true,
  },
  {
    path: "/so-dau-bai",
    text: "Số đầu bài",
    icon: DocumentTextIcon,
    hasDropdown: true,
  },
  {
    path: "/thong-ke-bao-cao",
    text: "Thống kê báo cáo",
    icon: ChartBarIcon,
    hasDropdown: true,
  },
  {
    path: "/quan-ly-hoc-tap",
    text: "Quản lý học tập",
    icon: DocumentTextIcon,
    hasDropdown: true,
  },
  {
    path: "/hoc-sinh",
    text: "Học sinh",
    icon: UsersIcon,
    hasDropdown: true,
  },
  {
    path: "/quan-tri-thong-tin",
    text: "Quản trị thông tin",
    icon: BriefcaseIcon,
    hasDropdown: true,
  },
];

// Settings menu configuration
export const settingsMenu = {
  profile: {
    label: "Thông tin cá nhân",
    path: "/profile",
  },
  signOut: {
    label: "Đăng xuất",
    path: "/login",
  },
};

// Lazy load components - chỉ tải khi cần thiết
const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const SoDauBai = lazy(() => import("@/pages/SoDauBai"));
const ThongKeBaoCao = lazy(() => import("@/pages/ThongKeBaoCao"));
const QuanLyHocTap = lazy(() => import("@/pages/QuanLyHocTap"));
const HocSinh = lazy(() => import("@/pages/HocSinh"));
const QuanTriThongTin = lazy(() => import("@/pages/QuanTriThongTin"));

export const RouterConfig = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <Error>Something went wrong</Error>,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "so-dau-bai",
          element: <SoDauBai />,
        },
        {
          path: "thong-ke-bao-cao",
          element: <ThongKeBaoCao />,
        },
        {
          path: "quan-ly-hoc-tap",
          element: <QuanLyHocTap />,
        },
        {
          path: "hoc-sinh",
          element: <HocSinh />,
        },
        {
          path: "quan-tri-thong-tin",
          element: <QuanTriThongTin />,
        },
      ],
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
  ]);
};
