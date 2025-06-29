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

  const token = localStorage.getItem("token");
  const firebaseUserStr = localStorage.getItem("firebaseUser");

  const handleLogout = async () => {
    try {
      if (token && token !== "firebase") {
        await fetch(`${baseUrl}/api/user/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("firebaseUser");
      onLogout();
      setMessage({ type: "success", text: "✅ تم تسجيل الخروج بنجاح" });
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
      setMessage({ type: "error", text: "❌ يرجى اختيار ملف صورة (JPEG, PNG, GIF)" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "❌ حجم الصورة يجب أن يكون أقل من 2MB" });
      return;
    }

    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    try {
      if (token === "firebase" && firebaseUserStr) {
        // Local-only update for Firebase user
        const firebaseUser = JSON.parse(firebaseUserStr);
        firebaseUser.photo = localUrl;
        localStorage.setItem("firebaseUser", JSON.stringify(firebaseUser));
        setUser(prev => prev ? { ...prev, avatar: localUrl } : null);
      } else if (token) {
        // Upload to Laravel API
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`${baseUrl}/api/user/update`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "فشل في تحديث الصورة");
        }

        const data = await response.json();
        const newAvatar = data.user?.avatar
          ? `${baseUrl}/storage/${data.user.avatar.replace(/^\/+/, "")}`
          : DEFAULT_AVATAR;

        setImagePreview(newAvatar);
        setUser(prev => prev ? { ...prev, avatar: data.user.avatar } : null);
      } else {
        throw new Error("لا يوجد توكن صالح");
      }

      setMessage({ type: "success", text: "✅ تم تحديث الصورة بنجاح" });
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ type: "error", text: "❌ فشل في تحديث الصورة" });
      // restore previous
      if (user?.avatar) {
        const orig = user.avatar.startsWith("http")
          ? user.avatar
          : `${baseUrl}/storage/${user.avatar.replace(/^\/+/, "")}`;
        setImagePreview(orig);
      } else {
        setImagePreview(DEFAULT_AVATAR);
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // Firebase user?
    if (token === "firebase" && firebaseUserStr) {
      const parsed = JSON.parse(firebaseUserStr);
      const [first, ...rest] = parsed.name.split(" ");
      setUser({
        id: 0,
        first_name: first,
        last_name: rest.join(" "),
        email: parsed.email,
        avatar: parsed.photo || DEFAULT_AVATAR,
      });
      setImagePreview(parsed.photo || DEFAULT_AVATAR);
      setLoading(false);
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

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
        if (!res.ok) throw new Error("فشل في جلب بيانات المستخدم");
        const { user: u } = await res.json();
        if (u) {
          const avatarPath = u.avatar
            ? `${baseUrl}/storage/${u.avatar.replace(/^\/+/, "")}`
            : DEFAULT_AVATAR;
          setUser(u);
          setImagePreview(avatarPath);
        } else {
          setError("❌ بيانات المستخدم غير متوفرة");
        }
      } catch (err: any) {
        setError(`⚠️ ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, token, firebaseUserStr]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        جاري التحميل...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      {message && (
        <div
          className={`mb-4 px-6 py-3 rounded font-bold shadow-lg ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="w-full max-w-md bg-[#1a1f27] rounded-xl shadow-lg p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">الملف الشخصي</h1>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={imagePreview}
              alt="صورة الملف الشخصي"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-500"
              onError={e => {
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
            {uploading ? "جاري التحميل..." : "تغيير الصورة"}
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
            <label className="block mb-1 text-gray-400">الاسم الأول</label>
            <input
              type="text"
              value={user?.first_name || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">الاسم الأخير</label>
            <input
              type="text"
              value={user?.last_name || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-400">البريد الإلكتروني</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 mt-4 bg-red-600 hover:bg-red-700 rounded text-white font-bold"
            disabled={uploading}
          >
            تسجيل خروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
