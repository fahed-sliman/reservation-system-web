import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterRequest } from "../../types";
import InputField from "../../components/inputs/InputsField";
import PasswordField from "../../components/inputs/PasswordFieldProps";

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const INITIAL_FORM_DATA: RegisterRequest = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  avatar: null,
};

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format.";
    if (!formData.password || formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    const formPayload = new FormData();
    formPayload.append("first_name", formData.firstName);
    formPayload.append("last_name", formData.lastName);
    formPayload.append("email", formData.email);
    formPayload.append("password", formData.password);
    formPayload.append("password_confirmation", formData.password);
    if (formData.avatar) formPayload.append("avatar", formData.avatar);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/register", {
        method: "POST",
        body: formPayload,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        setFormData(INITIAL_FORM_DATA);
        setImagePreview(null);
        setErrors({});
        navigate("/login");
      } else {
        const serverErrors: Errors = {};
        if (result.errors) {
          if (result.errors.first_name)
            serverErrors.firstName = result.errors.first_name[0];
          if (result.errors.last_name)
            serverErrors.lastName = result.errors.last_name[0];
          if (result.errors.email)
            serverErrors.email = result.errors.email[0];
          if (result.errors.password)
            serverErrors.password = result.errors.password[0];
          if (result.errors.username)
            serverErrors.lastName = result.errors.username[0]; // عرضها تحت last name
        }
        setErrors(serverErrors);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors((prev) => ({
        ...prev,
        email: "Unexpected error occurred. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-full h-screen bg-gray-950">
      {/* Left Image */}
      <div className="w-full md:w-1/2 relative h-[250px] md:h-screen group">
        <img
          src="/background.jpg"
          alt="Background"
          className="w-full h-full object-cover transition duration-300 brightness-90 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>

      {/* Form Section */}
      <section className="w-full md:w-1/2 flex flex-col justify-start px-4 py-4 md:py-8 md:px-10 h-screen">
        <div className="w-full max-w-[600px] bg-[#1a1f27] p-6 rounded-xl shadow-2xl mx-auto h-full flex flex-col">
          <nav className="mb-6">
            <ul className="flex space-x-4 text-white text-sm md:text-base">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-orange-500 font-bold">
                  Registration
                </Link>
              </li>
            </ul>
          </nav>

          <header>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Good Morning!
            </h1>
            <p className="text-sm text-gray-400 mb-4">
              Create your new account below.
            </p>
          </header>

          {/* Avatar Upload */}
          <div className="flex justify-center mb-4">
            <label htmlFor="imageUpload" className="relative cursor-pointer group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-[#2b313a] border-2 border-dashed border-gray-500 flex items-center justify-center">
                  <span className="text-white text-2xl group-hover:text-orange-500">
                    +
                  </span>
                </div>
              )}
              <input
                type="file"
                id="imageUpload"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex-grow overflow-hidden"
            noValidate
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <InputField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName} 
              />
            </div>

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
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword((prev) => !prev)}
              error={errors.password}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition duration-300 text-lg cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Registering...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <footer className="mt-6 flex items-center text-gray-400 text-xs md:text-sm">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4zm0 1a3 3 0 100-6 3 3 0 000 6z" />
                <path
                  fillRule="evenodd"
                  d="M0 8a8 8 0 1116 0 8 8 0 01-16 0zm10 10H6a2 2 0 110-4h8a2 2 0 110 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">ReserGo</span>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;
