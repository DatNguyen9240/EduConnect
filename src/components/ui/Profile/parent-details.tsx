'use client';

import type React from 'react';

interface ParentDetailsProps {
  fullName: string;
  phone: string;
  parentEmail: string;
}

const ParentDetails: React.FC<ParentDetailsProps> = ({ fullName, phone, parentEmail }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Parent Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-600">Full Name:</span>
            <span className="ml-2 text-gray-800">{fullName}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-600">Phone:</span>
            <span className="ml-2 text-gray-800">{phone}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">Contact Email:</span>
            <span className="ml-2 text-gray-800">{parentEmail}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDetails;
