import React from "react";

type InputProps = {
  type?: "text" | "number" | "password" | "email" | "file";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  label?: string;
};

export const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  label,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`p-2 border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 w-full ${className}`}
      />
    </div>
  );
};
