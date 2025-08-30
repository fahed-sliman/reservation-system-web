// InputField.tsx
import React, { type ChangeEvent } from "react";
import { useTheme } from "../../context/ThemeContext";

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  error,
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className={`block mb-1 text-sm font-semibold ${
        theme === "dark" ? "text-gray-400" : "text-gray-700"
      }`}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full px-3 py-2 border rounded focus:outline-none transition text-sm ${
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
    </div>
  );
};

export default InputField;