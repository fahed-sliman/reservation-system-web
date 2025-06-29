import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputsField";
import PasswordField from "../../components/PasswordFieldProps";
import { FaGoogle } from "react-icons/fa";

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.message?.toLowerCase() || "";

        if (errorMessage.includes("email")) {
          setErrors({ email: "Email not found." });
        } else if (errorMessage.includes("password")) {
          setErrors({ password: "Incorrect password." });
        } else if (errorMessage.includes("credentials")) {
          setErrors({
            email: "Email not found or incorrect.",
            password: "Incorrect password.",
          });
        } else {
          setErrors({
            email: "Login failed. Please try again.",
            password: "Something went wrong.",
          });
        }

        return;
      }

      if (result.token) {
        localStorage.setItem("token", result.token);
        onLoginSuccess(result.token);
        alert("Login successful!");
        navigate("/home");
      } else {
        setErrors({ email: "Login response missing token." });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: "Server error. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };


const handleFakeGoogleLogin = () => {
  setIsGoogleLoading(true);

  setTimeout(() => {
    setIsGoogleLoading(false);
    alert("Login with Google successfully");
    navigate("/home"); // بعد نجاح تسجيل الدخول
  }, 2000);
};

  // Removed handleGoogleLogin and Firebase imports

  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen w-full bg-gray-950">
      {/* الصورة */}
      <div className="w-full md:w-1/2 relative h-[250px] md:h-screen group">
        <img
          src="/background.jpg"
          alt="background"
          className="w-full h-full object-cover transition duration-300 brightness-90 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none group-hover:opacity-0 transition duration-300" />
      </div>

      {/* النموذج */}
      <div className="w-full md:w-1/2 flex flex-col justify-start px-6 py-6 md:py-12 md:px-16 h-auto md:h-screen overflow-auto">
        <div className="w-full max-w-[600px] bg-[#1a1f27] p-8 rounded-xl shadow-2xl mx-auto">
          <nav className="mb-8">
            <ul className="flex space-x-6 text-white text-sm md:text-base">
              <li>
                <Link to="/login" className="text-orange-500 font-bold">Login</Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition">Registration</Link>
              </li>
            </ul>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-base text-gray-400 mb-6">Please enter your email and password.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <PasswordField
              label="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword((prev) => !prev)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-700 transition duration-300 text-lg cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* زر جوجل بدون أي وظيفة */}
          <button
  type="button"
  disabled={isGoogleLoading}
  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 text-white rounded hover:border-orange-500 hover:shadow-lg transition duration-300 text-sm md:text-base disabled:opacity-50"
  onClick={handleFakeGoogleLogin}
>
  {isGoogleLoading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
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
      Signing in...
    </>
  ) : (
    <>
      <FaGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </>
  )}
</button>
          </form>

          <footer className="mt-6 flex items-center text-gray-400 text-xs md:text-sm">
            <div className="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z" />
                <path fillRule="evenodd" d="M0 8a8 8 0 1116 0 8 8 0 01-16 0zm10 10H6a2 2 0 110-4h8a2 2 0 110 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">ReserGo</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
