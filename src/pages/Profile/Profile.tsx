// src/pages/Profile/ProfilePage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string | null;
}

interface ProfilePageProps {
  onLogout: () => void;
}

const baseUrl = "http://127.0.0.1:8000";
const DEFAULT_AVATAR = "/default-avatar.png";

const ProfilePage: React.FC<ProfilePageProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    if (!token) return;

    setIsLoggingOut(true);
    try {
      const response = await fetch(`${baseUrl}/api/user/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }

      localStorage.removeItem("token");
      onLogout();
      setMessage({ type: "success", text: "✅ Logged out successfully" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error: any) {
      console.error("Logout error:", error);
      setMessage({ type: "error", text: `❌ ${error.message}` });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
      setMessage({ type: "error", text: "❌ Please select an image file (JPEG, PNG, GIF)" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "❌ Image size must be less than 2MB" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!token) {
      setMessage({ type: "error", text: "❌ Invalid token" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${baseUrl}/api/user/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // لا تضع Content-Type عند إرسال FormData
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update image");
      }

      // API ترجع avatar_url مباشرة
      const newAvatarUrl = data.avatar_url
        ? data.avatar_url.startsWith("http")
          ? data.avatar_url
          : `${baseUrl}/${data.avatar_url.replace(/^\/+/, "")}`
        : DEFAULT_AVATAR;

      setImagePreview(newAvatarUrl);

      // حدث الصورة في بيانات المستخدم المحلية
      setUser((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));

      setMessage({ type: "success", text: "✅ Image updated successfully" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage({ type: "error", text: `❌ ${err.message || "Failed to update image"}` });
      setTimeout(() => setMessage(null), 3000);

      // استعادة الصورة القديمة
      if (user?.avatar) {
        setImagePreview(user.avatar.startsWith("http") ? user.avatar : DEFAULT_AVATAR);
      } else {
        setImagePreview(DEFAULT_AVATAR);
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setMessage(null);

    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch user data");
        const { user: u } = await res.json();
        if (u) {
          const avatarPath = u.avatar
            ? `${baseUrl}/storage/${u.avatar.replace(/^\/+/g, "")}`
            : DEFAULT_AVATAR;
          setUser(u);
          setImagePreview(avatarPath);
        } else {
          setError("❌ User data not available");
        }
      } catch (err: any) {
        setError(`⚠️ ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4">Loading data...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-6">
      {message && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded font-bold shadow-lg ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ minWidth: 250, textAlign: "center" }}
        >
          {message.text}
        </div>
      )}

      <div className="w-full max-w-md bg-[#1a1f27] rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Profile</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={imagePreview || DEFAULT_AVATAR}
              alt="Profile avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
              }}
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            )}
          </div>
          <label
            htmlFor="avatarUpload"
            className={`mt-4 cursor-pointer ${
              uploading ? "text-gray-500" : "text-orange-500 hover:underline"
            }`}
            style={{ pointerEvents: uploading ? "none" : "auto" }}
          >
            {uploading ? "Uploading..." : "Change Image"}
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-400">First Name</label>
            <input
              type="text"
              value={user?.first_name || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Last Name</label>
            <input
              type="text"
              value={user?.last_name || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 mt-4 bg-red-600 hover:bg-red-700 rounded text-white font-bold flex items-center justify-center"
            disabled={uploading || isLoggingOut}
          >
            {isLoggingOut ? (
              <svg
                className="animate-spin h-6 w-6 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
