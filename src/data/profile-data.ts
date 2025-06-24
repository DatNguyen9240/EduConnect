import type { Profile } from '../types/profile';

// Mock profile data - có thể thay thế bằng API call thực tế
export const mockProfileData: Profile = {
  // Account table fields
  accountId: 1,
  username: 'nguyenvana',
  email: 'nguyenvana@example.com',
  roleId: 2, // Role 2 for parents

  // Parent table fields
  parentId: 1,
  fullName: 'Nguyễn Văn A',
  phone: '+84 123 456 789',
  parentEmail: 'nguyenvana@example.com',
};

// Có thể thêm nhiều profile khác để test
export const mockProfiles: Profile[] = [
  mockProfileData,
  {
    accountId: 2,
    username: 'tranthib',
    email: 'tranthib@example.com',
    roleId: 2,
    parentId: 2,
    fullName: 'Trần Thị B',
    phone: '+84 987 654 321',
    parentEmail: 'tranthib@example.com',
  },
  {
    accountId: 3,
    username: 'lethic',
    email: 'lethic@example.com',
    roleId: 3, // Student role
    parentId: 3,
    fullName: 'Lê Thị C',
    phone: '+84 555 666 777',
    parentEmail: 'lethic@example.com',
  },
];

// Role mapping data
export const roleMapping = {
  1: 'Admin',
  2: 'Parent',
  3: 'Student',
  4: 'Teacher',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  GET_PROFILE: '/api/profile',
  UPDATE_PROFILE: '/api/profile/update',
  CHANGE_PASSWORD: '/api/profile/change-password',
} as const;
