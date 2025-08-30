import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaCog } from 'react-icons/fa';
import ActionButton from './ActionButton';
import { useLanguage } from '../../context/LanguageContext';

interface ProfileActionsProps {
  onLogout: () => void;
  isLoggingOut: boolean;
  isDisabled: boolean;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ onLogout, isLoggingOut, isDisabled }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const texts = {
    ar: {
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      loggingOut: "جاري تسجيل الخروج..."
    },
    en: {
      settings: "Go to Settings",
      logout: "Logout",
      loggingOut: "Logging out..."
    }
  };

  const t = texts[language];

  return (
    <div className="mt-auto w-full space-y-4">
      <ActionButton
        onClick={() => navigate('/settings')}
        icon={<FaCog />}
        label={t.settings}
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        disabled={isDisabled}
      />
      <ActionButton
        onClick={onLogout}
        icon={isLoggingOut ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FaSignOutAlt />}
        label={isLoggingOut ? t.loggingOut : t.logout}
        className="bg-red-600 hover:bg-red-700 text-white"
        disabled={isDisabled || isLoggingOut}
      />
    </div>
  );
};

export default ProfileActions;
