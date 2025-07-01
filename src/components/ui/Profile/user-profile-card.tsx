import React from 'react';
import { Mail, Phone, UserCircle } from 'lucide-react';

export interface UserProfileCardProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return 'Chưa cập nhật';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Chưa cập nhật';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  firstName,
  lastName,
  email,
  phoneNumber,
  dateOfBirth,
  avatarUrl,
}) => {
  // Fallback: first letter of lastName or firstName
  const fallbackLetter = (lastName || firstName || 'U').charAt(0).toUpperCase();

  return (
    <div className="flex items-center bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto border border-blue-100">
      {/* Avatar */}
      <div className="flex-shrink-0 mr-6">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-600 border border-gray-200 shadow">
            <UserCircle className="w-16 h-16 text-blue-300 absolute" />
            <span className="relative z-10">{fallbackLetter}</span>
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {lastName} {firstName}
        </div>
        <div className="flex items-center text-gray-700">
          <Mail className="w-5 h-5 mr-2 text-blue-400" />
          <span>{email}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Phone className="w-5 h-5 mr-2 text-blue-400" />
          <span>{phoneNumber ? phoneNumber : 'Chưa cập nhật'}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="font-medium mr-2">Ngày sinh:</span>
          <span>{formatDate(dateOfBirth)}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
