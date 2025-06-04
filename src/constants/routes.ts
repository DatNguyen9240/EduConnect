import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/ProfileScreen',
  SO_DAU_BAI: '/so-dau-bai',
  THONG_KE_BAO_CAO: '/thong-ke-bao-cao',
  QUAN_LY_HOC_TAP: '/quan-ly-hoc-tap',
  HOC_SINH: '/hoc-sinh',
  QUAN_TRI_THONG_TIN: '/quan-tri-thong-tin',
} as const;

// Define a type for the Navbar item configuration
export interface NavbarItemConfig {
  path: string;
  text: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  hasDropdown?: boolean;
}

// Define the array of Navbar items
export const navbarItems: NavbarItemConfig[] = [
  {
    path: ROUTES.HOME,
    text: 'Trang chủ',
    icon: HomeIcon,
    hasDropdown: true,
  },
  {
    path: ROUTES.SO_DAU_BAI,
    text: 'Số đầu bài',
    icon: DocumentTextIcon,
    hasDropdown: true,
  },
  {
    path: ROUTES.THONG_KE_BAO_CAO,
    text: 'Thống kê báo cáo',
    icon: ChartBarIcon,
    hasDropdown: true,
  },
  {
    path: ROUTES.QUAN_LY_HOC_TAP,
    text: 'Quản lý học tập',
    icon: DocumentTextIcon,
    hasDropdown: true,
  },
  {
    path: ROUTES.HOC_SINH,
    text: 'Học sinh',
    icon: UsersIcon,
    hasDropdown: true,
  },
  {
    path: ROUTES.QUAN_TRI_THONG_TIN,
    text: 'Quản trị thông tin',
    icon: BriefcaseIcon,
    hasDropdown: true,
  },
];

// Settings menu configuration
export const settingsMenu = {
  profile: {
    label: 'Thông tin cá nhân',
    path: ROUTES.PROFILE,
  },
  signOut: {
    label: 'Đăng xuất',
    path: ROUTES.LOGIN,
  },
};
