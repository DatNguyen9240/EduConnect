import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-2 border border-gray-300 rounded-[16px] focus:ring-2 focus:ring-[#2962FF] bg-gray-50 text-sm ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
