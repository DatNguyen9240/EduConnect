import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfileById } from '../api/profile.api';
import { AppContext } from './app.context';
import type { Profile } from '../types/profile';

interface ProfileContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  fetchProfile: () => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  setProfile: () => {},
  fetchProfile: async () => {},
  loading: false,
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { userInfo } = useContext(AppContext);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!userInfo?.accountId) return;
    setLoading(true);
    const data = await getProfileById(userInfo.accountId);
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, [userInfo?.accountId]);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, fetchProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
