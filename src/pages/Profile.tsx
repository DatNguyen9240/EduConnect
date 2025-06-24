'use client';

import type React from 'react';
import { useProfile } from '../hooks/use-profile';
import AccountDetails from '@components/ui/Profile/account-details';
import ParentDetails from '@components/ui/Profile/parent-details';
import ProfileActions from '@components/ui/Profile/profile-actions';

const ProfilePage: React.FC = () => {
  const { profile } = useProfile();

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // TODO: Implement edit profile functionality
  };

  const handleChangePassword = () => {
    console.log('Change password clicked');
    // TODO: Implement change password functionality
  };

  if (!profile) {
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

      <AccountDetails username={profile.username} email={profile.email} />

      <ParentDetails
        fullName={profile.fullName}
        phone={profile.phone}
        parentEmail={profile.parentEmail}
      />

      <ProfileActions onEditProfile={handleEditProfile} onChangePassword={handleChangePassword} />
    </div>
  );
};

export default ProfilePage;
