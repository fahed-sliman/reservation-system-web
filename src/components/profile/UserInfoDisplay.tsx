// src/components/profile/UserInfoDisplay.tsx
import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import type { User } from "../../context/AuthContext";


interface Props {
  user: User;
}

const UserInfoDisplay: React.FC<Props> = ({ user }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  const texts = {
    ar: { firstName: "الاسم الأول", lastName: "الاسم الأخير", email: "البريد الإلكتروني" },
    en: { firstName: "First Name", lastName: "Last Name", email: "Email Address" },
  };

  const t = texts[language];

  const inputStyle =
    theme === "dark"
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-gray-100 text-gray-900 border-gray-300";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.firstName}</label>
        <input
          type="text"
          value={user.first_name}
          disabled
          className={`w-full p-3 rounded-lg border ${inputStyle}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.lastName}</label>
        <input
          type="text"
          value={user.last_name}
          disabled
          className={`w-full p-3 rounded-lg border ${inputStyle}`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.email}</label>
        <input
          type="text"
          value={user.email}
          disabled
          className={`w-full p-3 rounded-lg border ${inputStyle}`}
        />
      </div>
    </div>
  );
};

export default UserInfoDisplay;
