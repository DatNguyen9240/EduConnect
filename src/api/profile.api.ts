import { axiosInstance } from '../lib/axios';
import type { Profile } from '../types/profile';
import type { AxiosError } from 'axios';

interface ProfileApiResponse {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  accountId?: string | null;
}

export const getProfileById = async (userId: string): Promise<Profile> => {
  const response = await axiosInstance.get<{ data: ProfileApiResponse }>(`/api/Profile/${userId}`);
  const data = response.data.data;
  return {
    firstName: data?.firstName ?? null,
    lastName: data?.lastName ?? null,
    email: data?.email ?? null,
    phoneNumber: data?.phoneNumber ?? null,
    dateOfBirth: data?.dateOfBirth ?? null,
    avatarUrl: data?.avatarUrl ?? null,
  };
};

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string; // ISO format
  avatarFile?: File; // Nếu có upload ảnh
}

export interface UpdateProfileResponse {
  success: boolean;
  data?: Profile;
  error?: string[];
}

export const updateProfileById = async (
  userId: string,
  formData: FormData
): Promise<UpdateProfileResponse> => {
  try {
    const response = await axiosInstance.put<UpdateProfileResponse>(
      `/api/Profile/${userId}`,
      formData
    );
    return response.data;
  } catch (error) {
    if ((error as AxiosError<UpdateProfileResponse>).response?.data) {
      return (error as AxiosError<UpdateProfileResponse>).response!.data;
    }
    throw error;
  }
};

export const getStudentsByParentId = (parentId: string, params?: Record<string, unknown>) => {
  return axiosInstance.get<{
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    success: boolean;
    message: string;
    data: unknown[];
    error: unknown;
  }>(
    `https://educonnectswd-buh0fbdfabcqfehm.australiaeast-01.azurewebsites.net/api/Parent/${parentId}/students`,
    params
  );
};
