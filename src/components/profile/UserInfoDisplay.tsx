import React from 'react';
import { FaEnvelope, FaUser } from 'react-icons/fa';
import type { User } from '../../types';

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, label, value }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <div className="flex items-center gap-3 mt-1">
      <span className="text-orange-400">{icon}</span>
      <p className="w-full px-4 py-2 rounded-md bg-gray-800 text-white select-all">{value}</p>
    </div>
  </div>
);

interface UserInfoDisplayProps {
  user: User | null;
}

const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <InfoField icon={<FaUser />} label="First Name" value={user?.first_name || 'N/A'} />
      <InfoField icon={<FaUser />} label="Last Name" value={user?.last_name || 'N/A'} />
      <InfoField icon={<FaEnvelope />} label="Email Address" value={user?.email || 'N/A'} />
    </div>
  );
};

export default UserInfoDisplay;