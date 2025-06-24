'use client';

import type React from 'react';

interface AccountDetailsProps {
  username: string;
  email: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ username, email }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Account Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-600">Username:</span>
            <span className="ml-2 text-gray-800">{username}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="ml-2 text-gray-800">{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
