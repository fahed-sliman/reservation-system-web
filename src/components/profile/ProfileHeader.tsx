import React from "react";
import type { User } from "../../types/auth";
import { useLanguage } from "../../context/LanguageContext";

interface ProfileHeaderProps {
  user: User | null;
  imagePreview: string;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  imagePreview,
  uploading,
  onFileChange,
}) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col items-center">
      <img
        src={imagePreview}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-orange-400 object-cover mb-4"
      />
      <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
        {uploading
          ? language === "ar"
            ? "جاري الرفع..."
            : "Uploading..."
          : language === "ar"
          ? "تغيير الصورة"
          : "Change Picture"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />
      </label>
      <h2 className="text-xl font-bold mt-3">
        {user?.first_name} {user?.last_name}
      </h2>
    </div>
  );
};

export default ProfileHeader;
