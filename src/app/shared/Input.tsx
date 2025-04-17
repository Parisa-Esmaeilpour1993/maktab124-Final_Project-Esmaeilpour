import React, { forwardRef } from "react";

type InputProps = {
  type?: "text" | "number" | "password" | "email" | "file";
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      value,
      onChange,
      placeholder,
      className = "",
      label,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && <label className="text-primary">{label}</label>}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`p-2 border text-secondary border-accent rounded-md outline-none focus:ring-1 focus:ring-secondary w-full ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
