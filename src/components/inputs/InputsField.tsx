import React, { type ChangeEvent } from "react";

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
}) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-400 mb-1 text-sm font-semibold">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete="off"
      className={` w-full px-3 py-2 border rounded text-white bg-[#22272e] focus:outline-none transition
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
  </div>
);

export default InputField;
