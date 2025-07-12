import React from 'react';
import type { User } from '../../types';


const DEFAULT_AVATAR = "/download (1).jpeg";

interface ProfileHeaderProps {
  user: User | null;
  imagePreview: string;
  uploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, imagePreview, uploading, onFileChange }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <img
          src={imagePreview}
          alt="Profile Avatar"
          className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 shadow-lg"
          onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_AVATAR; }}
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      

      <label
        htmlFor="avatarUpload"
        className={`mt-4 font-semibold text-orange-400 hover:text-orange-300 transition-colors ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        {uploading ? "Uploading..." : "Change Profile Picture"}
      </label>
      <input
        id="avatarUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
        disabled={uploading}
      />

      <div className="mt-6 w-full">
        <h2 className="text-3xl font-bold text-white">
          {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
        </h2>
      </div>
    </div>
  );
};

export default ProfileHeader;