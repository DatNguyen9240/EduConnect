import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfileById, updateProfileById } from '@/api/profile.api';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app.context';
import { toast } from 'react-toastify';
import type { Profile } from '@/types/profile';
import axios from 'axios';

interface ErrorResponse {
  error?: string[];
}

export const useProfile = () => {
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.userId || '';
  const queryClient = useQueryClient();

  // Query để lấy thông tin profile
  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfileById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 phút
  });

  // Mutation để cập nhật profile
  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => updateProfileById(userId, formData),
    onSuccess: (data) => {
      if (data.success) {
        // Cập nhật cache với dữ liệu mới
        queryClient.setQueryData<Profile>(['profile', userId], data.data);
        toast.success('Cập nhật thông tin thành công');
      } else {
        toast.error(data.error?.[0] || 'Cập nhật thất bại');
      }
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message || 'Cập nhật thất bại');
      } else if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        toast.error(errorData.error?.[0] || 'Cập nhật thất bại');
      } else {
        toast.error('Cập nhật thất bại');
      }
    },
  });

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: (formData: FormData) => updateProfileMutation.mutate(formData),
    isUpdating: updateProfileMutation.isPending,
  };
};

export default useProfile;
