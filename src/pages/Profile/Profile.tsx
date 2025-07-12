
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/auth";
import { FaLock } from 'react-icons/fa';
import UserInfoDisplay from "../../components/profile/UserInfoDisplay";
import ProfileActions from "../../components/profile/ProfileActions";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfilePageSkeleton from "../../components/profile/ProfilePageSkeleton";


interface ProfilePageProps {
  onLogout: () => void;
}

const baseUrl = "http://127.0.0.1:8000";
const DEFAULT_AVATAR = "/download (1).jpeg";

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // States
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showMessage = (type: "success" | "error", text: string, duration: number = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  useEffect(() => {
    if (!token) { 
      navigate("/login"); 
      return; 
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/profile`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch data");

        if (data.user) {
          const fetchedUser = data.user as User;
          setUser(fetchedUser);
          if (fetchedUser.avatar) {
            const fullAvatarUrl = `${baseUrl}/storage/${fetchedUser.avatar}`;
            setImagePreview(fullAvatarUrl);
          } else {
            setImagePreview(DEFAULT_AVATAR);
          }
        } else {
          throw new Error("User data not available in API response");
        }
      } catch (err: any) {
        setError(`⚠️ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate, token, onLogout]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    if (!file.type.startsWith("image/")) return showMessage("error", "❌ Please select a valid image file.");
    if (file.size > 2 * 1024 * 1024) return showMessage("error", "❌ Image size must be less than 2MB.");
    
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${baseUrl}/api/user/update`, { method: "POST", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update image");
      setImagePreview(data.avatar_url);
      showMessage("success", "✅ Image updated successfully!");
    } catch (err: any) {
      showMessage("error", `❌ ${err.message || "An error occurred"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    setIsLoggingOut(true);
    try {
      await fetch(`${baseUrl}/api/user/logout`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error("Logout API call failed, but logging out client-side anyway:", error);
    } finally {
      localStorage.removeItem("token");
      onLogout();
      showMessage("success", "👋 Logged out successfully. Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  // عرض الواجهة الهيكلية أثناء التحميل
  if (loading) {
    return <ProfilePageSkeleton />;
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-xl text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-[#1a1f27] text-white flex justify-center items-center p-4 sm:p-8">
      {message && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg font-bold shadow-2xl text-white ${message.type === "success" ? "bg-green-600" : "bg-red-600"}`}>{message.text}</div>
      )}

      <div className="w-full max-w-5xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          <div className="md:col-span-1 flex flex-col justify-between">
            <ProfileHeader
              user={user}
              imagePreview={imagePreview}
              uploading={uploading}
              onFileChange={handleFileChange}
            />
            <ProfileActions
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
              isDisabled={uploading}
            />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-orange-400 border-b border-gray-700 pb-3 mb-6">User Details</h3>
            <UserInfoDisplay user={user} />
            
            {user && user.is_blocked == 1 && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mt-8 flex items-center gap-4">
                <FaLock className="text-3xl flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Account Blocked</h4>
                  <p className="text-sm">
                    This account is currently blocked and some features may be limited.
                    {user.blocked_until && ` Access will be restored after ${new Date(user.blocked_until).toLocaleDateString()}.`}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;