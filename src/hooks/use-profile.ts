'use client';

import { useEffect, useState, useContext } from 'react';
import type { Profile } from '../types/profile';
import { getProfileById } from '../api/profile.api';
import { AppContext } from '../contexts/app.context';

export const useProfile = () => {
  const { userInfo } = useContext(AppContext);
  const userId = userInfo?.userId;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfileById(userId);
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Method to update profile
  const updateProfile = async (userId: string /*, updates: Partial<Profile> */) => {
    try {
      setLoading(true);
      // TODO: Gọi API cập nhật profile với updates khi có
      const updatedProfile = await getProfileById(userId);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    setProfile,
    updateProfile,
  };
};
