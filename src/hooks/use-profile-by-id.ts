import { useEffect, useState } from 'react';
import type { Profile } from '../types/profile';
import { getProfileById } from '../api/profile.api';

export const useProfileById = (userId: string | null | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);
    getProfileById(userId)
      .then((data) => setProfile(data))
      .catch(() => {
        setError('Không thể tải thông tin người dùng');
        setProfile(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return { profile, loading, error };
};
