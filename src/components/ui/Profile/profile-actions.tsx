'use client';

import type React from 'react';

interface ProfileActionsProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onEditProfile, onChangePassword }) => {
  return (
    <div className="mt-6 pt-4 border-t flex gap-3">
      <button
        onClick={onEditProfile}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Edit Profile
      </button>
      <button
        onClick={onChangePassword}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Change Password
      </button>
    </div>
  );
};

export default ProfileActions;
