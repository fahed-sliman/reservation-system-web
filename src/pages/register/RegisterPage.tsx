import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import InputField from "../../components/inputs/InputsField";
import PasswordField from "../../components/inputs/PasswordFieldProps";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth, type RegisterRequest, type AuthResponse } from "../../context/AuthContext";

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { register } = useAuth();

  const [formData, setFormData] = useState<Omit<RegisterRequest, "fingerprint"> & { confirmPassword?: string }>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    avatar: null,
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [K in keyof Omit<RegisterRequest, "fingerprint"> | "confirmPassword" | "general"]?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // === الترجمات ===
  const texts = {
    ar: {
      login: "تسجيل الدخول",
      registration: "إنشاء حساب",
      goodMorning: "صباح الخير!",
      createAccount: "أنشئ حسابك الجديد أدناه.",
      firstName: "الاسم الأول",
      lastName: "اسم العائلة",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      register: "إنشاء الحساب",
      registering: "جاري التسجيل...",
      accountCreated: "تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.",
      unexpectedError: "حدث خطأ غير متوقع. حاول مرة أخرى.",
      firstNameRequired: "الاسم الأول مطلوب.",
      lastNameRequired: "اسم العائلة مطلوب.",
      emailRequired: "البريد الإلكتروني مطلوب.",
      invalidEmail: "البريد الإلكتروني غير صالح.",
      passwordMinLength: "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
      confirmPasswordRequired: "تأكيد كلمة المرور مطلوب.",
      passwordsDoNotMatch: "كلمات المرور غير متطابقة.",
      emailAlreadyTaken: "البريد الإلكتروني مستخدم بالفعل",
    },
    en: {
      login: "Login",
      registration: "Registration",
      goodMorning: "Good Morning!",
      createAccount: "Create your new account below.",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Register",
      registering: "Registering...",
      accountCreated: "Account created successfully! You can now log in.",
      unexpectedError: "Unexpected error occurred. Please try again.",
      firstNameRequired: "First name is required.",
      lastNameRequired: "Last name is required.",
      emailRequired: "Email is required.",
      invalidEmail: "Invalid email format.",
      passwordMinLength: "Password must be at least 8 characters.",
      confirmPasswordRequired: "Confirm password is required.",
      passwordsDoNotMatch: "Passwords do not match.",
      emailAlreadyTaken: "Email already taken",
    },
  };

  const currentTexts = texts[language];

  // === تغيير الحقول ===
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  // تنظيف URL الصورة
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // === التحقق ===
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = currentTexts.firstNameRequired;
    if (!formData.lastName?.trim()) newErrors.lastName = currentTexts.lastNameRequired;
    if (!formData.email?.trim()) newErrors.email = currentTexts.emailRequired;
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = currentTexts.invalidEmail;
    if (!formData.password || formData.password.length < 8) newErrors.password = currentTexts.passwordMinLength;
    if (!formData.confirmPassword) newErrors.confirmPassword = currentTexts.confirmPasswordRequired;
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = currentTexts.passwordsDoNotMatch;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === إرسال ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const registerData: RegisterRequest = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar,
      fingerprint: null,
    };

    try {
      const result: AuthResponse = await register(registerData);

      if (result.success) {
        toast.success(result.message || currentTexts.accountCreated, {
          duration: 4000,
          style: {
            background: '#22c55e',
            color: 'white',
            border: '1px solid #16a34a',
          },
        });
        
        // التوجيه بعد 2 ثانية
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const msg = (result.message || "").toLowerCase();
        if (msg.includes("email") && msg.includes("taken")) {
          setErrors({ email: currentTexts.emailAlreadyTaken });
        } else if (result.message) {
          setErrors({ general: result.message });
          toast.error(result.message);
        } else {
          setErrors({ general: currentTexts.unexpectedError });
          toast.error(currentTexts.unexpectedError);
        }
      }
    } catch {
      const errorMsg = currentTexts.unexpectedError;
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col-reverse md:flex-row h-screen w-full ${theme === "dark" ? "bg-gray-950" : "bg-gray-100"}`}>
      {/* Left image section */}
      <div className="w-full md:w-1/2 relative h-[280px] md:h-screen group">
        <img
          src="/background.jpg"
          alt="background"
          className="w-full h-full object-cover transition duration-300 brightness-90 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none group-hover:opacity-0 transition duration-300" />
      </div>

      {/* Right form section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-6 md:py-12 md:px-16 h-auto md:h-screen md:overflow-hidden overflow-auto">
        <div className={`w-full max-w-[600px] p-6 md:p-8 rounded-xl shadow-2xl mx-auto ${theme === "dark" ? "bg-[#1a1f27]" : "bg-white"} max-h-full md:max-h-none overflow-y-auto md:overflow-visible`}>
          
          {/* Header navigation */}
          <nav className="mb-8 flex justify-between text-sm md:text-base">
            <div className="flex space-x-6">
              <Link 
                to="/login" 
                className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"} transition`}
              >
                {currentTexts.login}
              </Link>
              <span className="text-orange-500 font-bold">{currentTexts.registration}</span>
            </div>
          </nav>

          {/* Header */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {currentTexts.goodMorning}
          </h1>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6`}>
            {currentTexts.createAccount}
          </p>

          {/* General error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          {/* تحميل الصورة */}
          <div className="flex justify-center mb-6">
            <label htmlFor="imageUpload" className="relative cursor-pointer group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-orange-500" />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center ${
                    theme === "dark" ? "bg-[#2b313a]" : "bg-gray-100"
                  }`}
                >
                  <span className={`text-2xl group-hover:text-orange-500 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    +
                  </span>
                </div>
              )}
              <input type="file" id="imageUpload" name="avatar" accept="image/*" onChange={handleChange} className="hidden" />
            </label>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label={currentTexts.firstName}
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                disabled={isLoading}
              />
              <InputField
                label={currentTexts.lastName}
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                disabled={isLoading}
              />
            </div>

            <InputField
              label={currentTexts.email}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />

            <PasswordField
              label={currentTexts.password}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword((p) => !p)}
              error={errors.password}
              disabled={isLoading}
            />

            <PasswordField
              label={currentTexts.confirmPassword}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ""}
              onChange={handleChange}
              showPassword={showConfirmPassword}
              toggleShowPassword={() => setShowConfirmPassword((p) => !p)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full px-4 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 disabled:bg-orange-400 transition duration-300 text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? currentTexts.registering : currentTexts.register}
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;