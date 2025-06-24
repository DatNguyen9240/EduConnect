'use client';

import { useEffect, useState } from 'react';
import type { Profile } from '../types/profile';
import { ProfileService } from '../services/profile-service';

// Remove the dummy data from here since it's now in data/profile-data.ts

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await ProfileService.getProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Method to update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const updatedProfile = await ProfileService.updateProfile(updates);
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
