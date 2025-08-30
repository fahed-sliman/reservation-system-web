
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaLock, FaCheckCircle } from "react-icons/fa";
// import UserInfoDisplay from "../../components/profile/UserInfoDisplay";
// import ProfileActions from "../../components/profile/ProfileActions";
// import ProfileHeader from "../../components/profile/ProfileHeader";
// import ProfilePageSkeleton from "../../components/profile/ProfilePageSkeleton";
// import { useLanguage } from "../../context/LanguageContext";
// import { useTheme } from "../../context/ThemeContext";
// import { useAuth } from "../../context/AuthContext";
// import type { User } from "../../types/auth";

// const baseUrl = "http://127.0.0.1:8000";
// const DEFAULT_AVATAR = "/download (1).jpeg";

// /* ---------------- Success Modal ---------------- */
// const SuccessModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   message: string;
//   theme: string;
//   buttonText: string;
// }> = ({ isOpen, onClose, message, theme, buttonText }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className={`${theme === "dark" ? "bg-[#1a1f27]" : "bg-white"} rounded-xl p-6 max-w-md w-full shadow-2xl`}>
//         <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//         </div>
//         <h3 className={`text-xl font-bold text-center mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
//           {theme === "dark" ? "تم بنجاح!" : "Success!"}
//         </h3>
//         <p className={`text-center mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{message}</p>
//         <button
//           onClick={onClose}
//           className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
//         >
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ------------- Helpers: normalize is_blocked ------------- */
// const toBoolean = (v: unknown): boolean => {
//   if (v === true || v === 1 || v === "1") return true;
//   return false; // treat 0, "0", false, null, undefined as not blocked
// };

// const formatLocalDate = (d?: string | null) => {
//   if (!d) return null;
//   const dt = new Date(d);
//   if (isNaN(dt.getTime())) return null;
//   return dt.toLocaleDateString();
// };

// /* --------------------- Page --------------------- */
// const ProfilePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { language } = useLanguage();
//   const { theme } = useTheme();
//   const { user: authUser, token, logout } = useAuth();

//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR);
//   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const showMessage = (type: "success" | "error", text: string, duration: number = 3000) => {
//     setMessage({ type, text });
//     setTimeout(() => setMessage(null), duration);
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(`${baseUrl}/api/user/profile`, {
//           headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to fetch data");

//         if (data.user) {
//           const fetchedUser = data.user as User & {
//             is_blocked?: boolean | number | "0" | "1";
//             blocked_until?: string | null;
//             avatar?: string | null;
//           };
//           setUser(fetchedUser);
//           if (fetchedUser.avatar) {
//             setImagePreview(`${baseUrl}/storage/${fetchedUser.avatar}`);
//           } else {
//             setImagePreview(DEFAULT_AVATAR);
//           }
//         } else {
//           throw new Error("User data not available in API response");
//         }
//       } catch (err: any) {
//         setError(`⚠️ ${err.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [navigate, token]);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !token) return;
//     if (!file.type.startsWith("image/"))
//       return showMessage("error", language === "ar" ? "❌ الرجاء اختيار صورة صحيحة" : "❌ Please select a valid image file.");
//     if (file.size > 2 * 1024 * 1024)
//       return showMessage("error", language === "ar" ? "❌ حجم الصورة يجب أن يكون أقل من 2MB" : "❌ Image size must be less than 2MB.");

//     setUploading(true);
//     const formData = new FormData();
//     formData.append("avatar", file);

//     try {
//       const response = await fetch(`${baseUrl}/api/user/update`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
//         body: formData,
//       });
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Failed to update image");
//       setImagePreview(data.avatar_url);
//       showMessage("success", language === "ar" ? "✅ تم تحديث الصورة بنجاح!" : "✅ Image updated successfully!");
//     } catch (err: any) {
//       showMessage("error", `❌ ${err.message || (language === "ar" ? "حدث خطأ" : "An error occurred")}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     setTimeout(() => {
//       setIsLoggingOut(false);
//       setShowLogoutModal(true);
//     }, 1000);
//   };

//   const handleLogoutModalClose = async () => {
//     setShowLogoutModal(false);
//     try {
//       await logout();
//       navigate("/login");
//     } catch {
//       /* ignore */
//     }
//   };

//   if (loading) return <ProfilePageSkeleton />;

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-xl text-center p-4">
//         {error}
//       </div>
//     );
//   }

//   const logoutTexts = {
//     ar: {
//       success: "👋 تم تسجيل الخروج بنجاح!",
//       message: "شكراً لاستخدامك ReserGo. نراك قريباً!",
//       button: "الذهاب لتسجيل الدخول",
//     },
//     en: {
//       success: "👋 Logged out successfully!",
//       message: "Thank you for using ReserGo. See you soon!",
//       button: "Go to Login",
//     },
//   };
//   const currentLogoutTexts = logoutTexts[language];

//   // ---- Status texts (blocked/unblocked) ----
//   const statusTexts = {
//     ar: {
//       okTitle: "حالة الحساب",
//       okLine: "✅ حالة الحساب جيدة — لا يوجد حظر",
//       blockedTitle: "الحساب محظور",
//       blockedLine: "هذا الحساب محظور حالياً وقد يتم تقييد بعض الميزات.",
//       untilPrefix: "سيتم رفع الحظر بعد ",
//     },
//     en: {
//       okTitle: "Account Status",
//       okLine: "✅ Account in good standing — No bans",
//       blockedTitle: "Account Blocked",
//       blockedLine: "This account is currently blocked and some features may be limited.",
//       untilPrefix: "Access will be restored after ",
//     },
//   };
//   const t = statusTexts[language];

//   const isBlocked = toBoolean(user?.is_blocked);
//   const blockedUntil = formatLocalDate((user as any)?.blocked_until ?? null);

//   return (
//     <div
//       className={`min-h-screen flex justify-center items-center p-4 sm:p-8 ${
//         theme === "dark" ? "bg-gradient-to-br from-gray-900 to-[#1a1f27] text-white" : "bg-gray-100 text-gray-900"
//       }`}
//     >
//       {message && (
//         <div
//           className={`fixed top-5 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-lg font-bold shadow-2xl text-white ${
//             message.type === "success" ? "bg-green-600" : "bg-red-600"
//           }`}
//         >
//           {message.text}
//         </div>
//       )}

//       <div
//         className={`w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-8 ${
//           theme === "dark" ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white border border-gray-200"
//         }`}
//       >
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
//           <div className="md:col-span-1 flex flex-col justify-between">
//             <ProfileHeader user={user || authUser} imagePreview={imagePreview} uploading={uploading} onFileChange={handleFileChange} />
//             <ProfileActions onLogout={handleLogout} isLoggingOut={isLoggingOut} isDisabled={uploading} />
//           </div>

//           <div className="md:col-span-2">
//             <h3 className="text-2xl font-bold text-orange-400 border-b border-gray-700 pb-3 mb-6">
//               {language === "ar" ? "تفاصيل المستخدم" : "User Details"}
//             </h3>

//             <UserInfoDisplay user={user || authUser} />

//             {/* -------- Account Status Card -------- */}
//             {!isBlocked ? (
//               <div
//                 className={`mt-8 rounded-lg p-4 border flex items-start gap-4 ${
//                   theme === "dark"
//                     ? "bg-green-500/10 border-green-500/30 text-green-300"
//                     : "bg-green-50 border-green-200 text-green-700"
//                 }`}
//               >
//                 <FaCheckCircle className="text-2xl flex-shrink-0" />
//                 <div>
//                   <h4 className="font-bold text-lg">{t.okTitle}</h4>
//                   <p className="text-sm">{t.okLine}</p>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className={`mt-8 rounded-lg p-4 border flex items-start gap-4 ${
//                   theme === "dark"
//                     ? "bg-red-500/10 border-red-500/30 text-red-400"
//                     : "bg-red-50 border-red-200 text-red-700"
//                 }`}
//               >
//                 <FaLock className="text-2xl flex-shrink-0" />
//                 <div>
//                   <h4 className="font-bold text-lg">{t.blockedTitle}</h4>
//                   <p className="text-sm">
//                     {t.blockedLine}
//                     {blockedUntil ? ` ${t.untilPrefix}${blockedUntil}` : ""}
//                     {language === "en" && blockedUntil ? "." : ""}
//                   </p>
//                 </div>
//               </div>
//             )}
//             {/* ------------------------------------- */}
//           </div>
//         </div>
//       </div>

//       {/* Logout Success Modal */}
//       <SuccessModal
//         isOpen={showLogoutModal}
//         onClose={handleLogoutModalClose}
//         message={currentLogoutTexts.message}
//         theme={theme}
//         buttonText={currentLogoutTexts.button}
//       />
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ 1. استيراد toast
import { FaLock, FaCheckCircle } from "react-icons/fa";
import UserInfoDisplay from "../../components/profile/UserInfoDisplay";
import ProfileActions from "../../components/profile/ProfileActions";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfilePageSkeleton from "../../components/profile/ProfilePageSkeleton";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types/auth";

const baseUrl = "http://127.0.0.1:8000";
const DEFAULT_AVATAR = "/download (1).jpeg";

// ❌ 2. تم حذف مكون SuccessModal بالكامل

/* ------------- Helpers: normalize is_blocked ------------- */
const toBoolean = (v: unknown): boolean => {
  if (v === true || v === 1 || v === "1") return true;
  return false;
};

const formatLocalDate = (d?: string | null) => {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString();
};

/* --------------------- Page --------------------- */
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { theme } = useTheme();
  const { user: authUser, token, logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_AVATAR);
  const [uploading, setUploading] = useState(false);
  
  // ❌ 3. تم حذف الحالات الخاصة بالرسائل والمودال القديم
  // const [message, setMessage] = useState(...);
  // const [isLoggingOut, setIsLoggingOut] = useState(false);
  // const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // ❌ تم حذف دالة showMessage

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch data");

        if (data.user) {
          const fetchedUser = data.user as User & {
            is_blocked?: boolean | number | "0" | "1";
            blocked_until?: string | null;
            avatar?: string | null;
          };
          setUser(fetchedUser);
          if (fetchedUser.avatar) {
            setImagePreview(`${baseUrl}/storage/${fetchedUser.avatar}`);
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
  }, [navigate, token]);

  // ✅ 4. تعديل دالة رفع الصورة لتستخدم toast
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    if (!file.type.startsWith("image/")) {
        return toast.error(language === "ar" ? "❌ الرجاء اختيار صورة صحيحة" : "❌ Please select a valid image file.");
    }
    if (file.size > 2 * 1024 * 1024) {
        return toast.error(language === "ar" ? "❌ حجم الصورة يجب أن يكون أقل من 2MB" : "❌ Image size must be less than 2MB.");
    }
    
    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const loadingToast = toast.loading(language === "ar" ? "جاري رفع الصورة..." : "Uploading image...");

    try {
      const response = await fetch(`${baseUrl}/api/user/update`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update image");
      setImagePreview(data.avatar_url);
      toast.success(language === "ar" ? "✅ تم تحديث الصورة بنجاح!" : "✅ Image updated successfully!", { id: loadingToast });
    } catch (err: any) {
      toast.error(`❌ ${err.message || (language === "ar" ? "حدث خطأ" : "An error occurred")}`, { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  // ✅ 5. تعديل دالة تسجيل الخروج لعرض تنبيه تأكيد أنيق
  const handleLogout = () => {
    const logoutTexts = {
      ar: { title: "هل أنت متأكد من تسجيل الخروج؟", confirm: "نعم, خروج", cancel: "إلغاء" },
      en: { title: "Are you sure you want to log out?", confirm: "Yes, Log Out", cancel: "Cancel" },
    };
    const t = logoutTexts[language];

    toast(
      (toastInstance) => (
        <div className="flex flex-col items-center gap-4 p-2 text-white">
          <p className="font-bold">{t.title}</p>
          <div className="flex w-full gap-2">
            <button
              onClick={() => {
                _performLogout();
                toast.dismiss(toastInstance.id);
              }}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              {t.confirm}
            </button>
            <button
              onClick={() => toast.dismiss(toastInstance.id)}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-gray-600 rounded-md hover:bg-gray-700"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        style: { background: '#4b5563', border: '1px solid #6b7280' },
      }
    );
  };
  
  // ✅ 6. إنشاء دالة منفصلة لتنفيذ الخروج الفعلي
  const _performLogout = async () => {
    const loadingToast = toast.loading(language === "ar" ? "جاري تسجيل الخروج..." : "Logging out...");
    try {
      await logout();
      toast.success(language === "ar" ? "👋 تم تسجيل الخروج بنجاح!" : "👋 Logged out successfully!", { id: loadingToast });
      navigate("/login");
    } catch {
      toast.error(language === "ar" ? "فشل تسجيل الخروج" : "Logout failed.", { id: loadingToast });
    }
  };

  // ❌ 7. تم حذف دالة handleLogoutModalClose

  if (loading) return <ProfilePageSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400 text-xl text-center p-4">
        {error}
      </div>
    );
  }
  
  // ---- Status texts (blocked/unblocked) ----
  // هذا الجزء يبقى كما هو تمامًا لضمان عدم حدوث خطأ
  const statusTexts = {
    ar: {
      okTitle: "حالة الحساب",
      okLine: "✅ حالة الحساب جيدة — لا يوجد حظر",
      blockedTitle: "الحساب محظور",
      blockedLine: "هذا الحساب محظور حالياً وقد يتم تقييد بعض الميزات.",
      untilPrefix: "سيتم رفع الحظر بعد ",
    },
    en: {
      okTitle: "Account Status",
      okLine: "✅ Account in good standing — No bans",
      blockedTitle: "Account Blocked",
      blockedLine: "This account is currently blocked and some features may be limited.",
      untilPrefix: "Access will be restored after ",
    },
  };
  const t = statusTexts[language];

  const isBlocked = toBoolean(user?.is_blocked);
  const blockedUntil = formatLocalDate((user as any)?.blocked_until ?? null);

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-4 sm:p-8 ${
        theme === "dark" ? "bg-gradient-to-br from-gray-900 to-[#1a1f27] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ❌ 8. تم حذف شريط الرسائل العلوي */}
      
      <div
        className={`w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-8 ${
          theme === "dark" ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1 flex flex-col justify-between">
            <ProfileHeader user={user || authUser} imagePreview={imagePreview} uploading={uploading} onFileChange={handleFileChange} />
            {/* تم حذف isLoggingOut لأنه لم يعد ضرورياً */}
            <ProfileActions onLogout={handleLogout} isLoggingOut={false} isDisabled={uploading} />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-orange-400 border-b border-gray-700 pb-3 mb-6">
              {language === "ar" ? "تفاصيل المستخدم" : "User Details"}
            </h3>

            <UserInfoDisplay user={user || authUser} />
            
            {/* -------- Account Status Card -------- */}
            {!isBlocked ? (
              <div
                className={`mt-8 rounded-lg p-4 border flex items-start gap-4 ${
                  theme === "dark"
                    ? "bg-green-500/10 border-green-500/30 text-green-300"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                <FaCheckCircle className="text-2xl flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">{t.okTitle}</h4>
                  <p className="text-sm">{t.okLine}</p>
                </div>
              </div>
            ) : (
              <div
                className={`mt-8 rounded-lg p-4 border flex items-start gap-4 ${
                  theme === "dark"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <FaLock className="text-2xl flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">{t.blockedTitle}</h4>
                  <p className="text-sm">
                    {t.blockedLine}
                    {blockedUntil ? ` ${t.untilPrefix}${blockedUntil}` : ""}
                    {language === "en" && blockedUntil ? "." : ""}
                  </p>
                </div>
              </div>
            )}
            {/* ------------------------------------- */}
          </div>
        </div>
      </div>

      {/* ❌ 9. تم حذف استدعاء المودال */}
    </div>
  );
};

export default ProfilePage;