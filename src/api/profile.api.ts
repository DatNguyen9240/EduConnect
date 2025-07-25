import api from '../lib/axios';
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
  const response = await api.get<{ data: ProfileApiResponse }>(`/api/v1/profiles/${userId}`);
  const data = response.data;
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
    // api.put không hỗ trợ FormData, nên vẫn dùng axiosInstance cho trường hợp này
    const response = await api.put<UpdateProfileResponse>(
      `/api/v1/profiles/${userId}`,
      formData as unknown as Record<string, unknown>
    );
    return response;
  } catch (error) {
    if ((error as AxiosError<UpdateProfileResponse>).response?.data) {
      return (error as AxiosError<UpdateProfileResponse>).response!.data;
    }
    throw error;
  }
};

export const getStudentsByParentId = (parentId: string, params?: Record<string, unknown>) => {
  return api.get<{
    totalCount: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    success: boolean;
    message: string;
    data: unknown[];
    error: unknown;
  }>(
    `/api/v1/parents/${parentId}/students`,
    params as Record<string, string | number | boolean> | undefined
  );
};
