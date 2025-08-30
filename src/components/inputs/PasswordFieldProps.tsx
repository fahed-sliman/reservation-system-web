import React, { type ChangeEvent } from "react";
import { useTheme } from "../../context/ThemeContext";

interface PasswordFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  error?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
  error,
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4 relative">
      <label htmlFor={id} className={`block mb-1 text-sm font-semibold ${
        theme === "dark" ? "text-gray-400" : "text-gray-700"
      }`}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full px-3 py-2 border rounded pr-10 focus:outline-none transition text-sm ${
          theme === "dark"
            ? "text-white bg-[#22272e] border-gray-700 focus:border-orange-500 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/50"
            : "text-gray-900 bg-white border-gray-300 focus:border-orange-500 hover:border-orange-400 hover:shadow-md"
        } ${
          error
            ? "border-red-500 focus:border-red-500"
            : ""
        }`}
      />
      {error && (
        <p className="mt-1 text-red-500 text-xs font-medium">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={toggleShowPassword}
        className={`absolute right-3 top-8 transition text-sm select-none ${
          theme === "dark" 
            ? "text-gray-400 hover:text-white" 
            : "text-gray-600 hover:text-gray-800"
        }`}
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? "🙈" : "👁"}
      </button>
    </div>
  );
};

export default PasswordField;