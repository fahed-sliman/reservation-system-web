import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaSun, FaMoon } from "react-icons/fa";
import toast from 'react-hot-toast';
import InputField from "../../components/inputs/InputsField";
import PasswordField from "../../components/inputs/PasswordFieldProps";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth, type LoginRequest } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { login, user } = useAuth();

  const [formData, setFormData] = useState<Omit<LoginRequest, 'fingerprint'>>({
    email: '',
    password: null,
  });

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.email.trim()) {
      newErrors.email = language === "ar" ? "البريد الإلكتروني مطلوب." : "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = language === "ar" ? "البريد الإلكتروني غير صالح." : "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = language === "ar" ? "كلمة المرور مطلوبة." : "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = language === "ar" ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل." : "Password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    const loginData: LoginRequest = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const result = await login(loginData);

      if (result.success) {
        // عرض toast للنجاح مع اسم المستخدم
        const userName = user?.firstName || formData.email.split('@')[0];
        const successMessage = language === "ar" 
          ? `مرحباً ${userName}! تم تسجيل الدخول بنجاح`
          : `Welcome ${userName}! Login successful`;
        
        toast.success(successMessage, {
          duration: 3000,
          style: {
            background: '#22c55e',
            color: 'white',
            border: '1px solid #16a34a',
          },
        });
        
        // التوجيه بعد ثانية واحدة
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
      } else {
        const msg = (result.message || '').toLowerCase();
        if (msg.includes('email') || msg.includes('not found')) {
          setErrors({ email: language === "ar" ? "الحساب غير موجود" : "Email not found" });
        } else if (msg.includes('password')) {
          setErrors({ password: language === "ar" ? "كلمة المرور غير صحيحة" : "Password is invalid" });
        } else {
          const errorMsg = result.message || (language === "ar" ? "فشل تسجيل الدخول" : "Login failed");
          setErrors({ general: errorMsg });
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      const errorMsg = language === "ar" 
        ? "خطأ في الخادم. حاول لاحقًا." 
        : "Server error. Please try again later.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    // محاكاة تسجيل دخول جوجل
    setTimeout(() => {
      setIsGoogleLoading(false);
      const successMessage = language === "ar" 
        ? "مرحباً! تم تسجيل الدخول بجوجل بنجاح" 
        : "Welcome! Logged in with Google successfully";
      
      toast.success(successMessage, {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: 'white',
          border: '1px solid #16a34a',
        },
      });
      
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    }, 2000);
  };

  const t = {
    ar: {
      login: "تسجيل الدخول",
      registration: "إنشاء حساب",
      welcome: "مرحباً بعودتك!",
      subtitle: "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginBtn: "دخول",
      loggingIn: "جاري تسجيل الدخول...",
      google: "الدخول بواسطة جوجل",
      signingIn: "جاري التسجيل..."
    },
    en: {
      login: "Login",
      registration: "Registration",
      welcome: "Welcome Back!",
      subtitle: "Please enter your email and password.",
      email: "Email",
      password: "Password",
      loginBtn: "Login",
      loggingIn: "Logging in...",
      google: "Continue with Google",
      signingIn: "Signing in..."
    }
  };

  const texts = t[language];

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
      <div className="w-full md:w-1/2 flex flex-col justify-start px-6 py-6 md:py-12 md:px-16 h-auto md:h-screen overflow-auto">
        <div className={`w-full max-w-[600px] p-8 rounded-xl shadow-2xl mx-auto ${theme === "dark" ? "bg-[#1a1f27]" : "bg-white"}`}>
          
          {/* Header navigation */}
          <nav className="mb-8 flex justify-between text-sm md:text-base">
            <div className="flex space-x-6">
              <span className="text-orange-500 font-bold">{texts.login}</span>
              <Link to="/register" className={`${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"} transition`}>
                {texts.registration}
              </Link>
            </div>
            {/* Theme & Language toggle */}
            <div className="flex items-center space-x-4">
              <button
                className={` px-3 py-1 cursor-pointer border rounded text-sm hover:bg-orange-500 hover:text-white transition ${
                  theme === "dark" 
                    ? "border-gray-600 text-gray-300" 
                    : "border-gray-300 text-gray-600"
                }`}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
              </button>
              <button
                className={`px-3 py-1 border cursor-pointer rounded text-sm hover:bg-orange-500 hover:text-white transition ${
                  theme === "dark" 
                    ? "border-gray-600 text-gray-300" 
                    : "border-gray-300 text-gray-600"
                }`}
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              >
                {language.toUpperCase()}
              </button>
            </div>
          </nav>

          {/* Header */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {texts.welcome}
          </h1>
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-6`}>
            {texts.subtitle}
          </p>

          {/* General error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label={texts.email}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              disabled={isLoading}
            />
            <PasswordField
              label={texts.password}
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(p => !p)}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer w-full px-4 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 disabled:bg-orange-400 transition duration-300 text-lg flex items-center justify-center gap-2"
            >
              {isLoading && <FaMoon className="animate-spin w-4 h-4" />}
              {isLoading ? texts.loggingIn : texts.loginBtn}
            </button>

            <button
              type="button"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleLogin}
              className={`cursor-pointer w-full flex items-center justify-center gap-3 px-4 py-3 border rounded hover:border-orange-500 hover:shadow-lg transition duration-300 text-sm md:text-base disabled:opacity-50 ${
                theme === "dark" 
                  ? "border-gray-600 text-white" 
                  : "border-gray-300 text-gray-700"
              }`}
            >
              {isGoogleLoading ? (
                <>
                  <FaGoogle className="w-5 h-5" />
                  <span>{texts.signingIn}</span>
                </>
              ) : (
                <>
                  <FaGoogle className="w-5 h-5" />
                  <span>{texts.google}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className={`mt-6 flex items-center text-xs md:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1116 0 8 8 0 01-16 0zm10 10H6a2 2 0 110-4h8a2 2 0 110 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Mahzooj</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;