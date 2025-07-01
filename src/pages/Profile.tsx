'use client';

import React, { useState } from 'react';
import { ProfileProvider, useProfileContext } from '../contexts/profile.context';
import UserProfileCard from '@components/ui/Profile/user-profile-card';
import ProfileUpdateForm from '@components/ui/Profile/ProfileUpdateForm';

const ProfilePageInner: React.FC = () => {
  const { profile, loading, fetchProfile } = useProfileContext();
  const [editing, setEditing] = useState(false);

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Information</h2>
      <UserProfileCard
        firstName={profile.firstName || ''}
        lastName={profile.lastName || ''}
        email={profile.email || ''}
        phoneNumber={profile.phoneNumber || ''}
        dateOfBirth={profile.dateOfBirth}
        avatarUrl={profile.avatarUrl}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setEditing(true)}
      >
        Edit Profile
      </button>
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setEditing(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Cập nhật thông tin cá nhân</h3>
            <ProfileUpdateForm onSuccess={async () => { await fetchProfile(); setEditing(false); }} onCancel={() => setEditing(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => (
  <ProfileProvider>
    <ProfilePageInner />
  </ProfileProvider>
);

export default ProfilePage;
