// src/pages/Profile/components/ProfileActions.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import ActionButton from './ActionButton';

interface ProfileActionsProps {
  onLogout: () => void;
  isLoggingOut: boolean;
  isDisabled: boolean;
}


const ProfileActions: React.FC<ProfileActionsProps> = ({ onLogout, isLoggingOut, isDisabled }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-auto w-full space-y-4">
      <ActionButton
        onClick={() => navigate('/settings')}
        icon={<FaCog />}
        label="Go to Settings"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        disabled={isDisabled}
      />
      <ActionButton
        onClick={onLogout}
        icon={isLoggingOut ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FaSignOutAlt />}
        label={isLoggingOut ? "Logging out..." : "Logout"}
        className="bg-red-600 hover:bg-red-700 text-white"
        disabled={isDisabled || isLoggingOut}
      />
    </div>
  );
};

export default ProfileActions;