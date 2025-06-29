import React, { type ChangeEvent } from "react";

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
}) => (
  <div className="mb-4 relative">
    <label htmlFor={id} className="block text-gray-400 mb-1 text-sm font-semibold">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete="off"
      className={`w-full px-3 py-2 border rounded pr-10 text-white bg-[#22272e] focus:outline-none transition
        ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-700 focus:border-orange-500"
        }
        hover:border-orange-500 hover:shadow-lg hover:shadow-orange-600/50 text-sm
      `}
    />
    {error && (
      <p className="mt-1 text-red-500 text-xs font-medium">
        {error}
      </p>
    )}
    <button
      type="button"
      onClick={toggleShowPassword}
      className="absolute right-3 top-8 text-gray-400 hover:text-white transition text-sm select-none"
      aria-label={showPassword ? "Hide password" : "Show password"}
      tabIndex={-1}
    >
      {showPassword ? "🙈" : "👁"}
    </button>
  </div>
);

export default PasswordField;
