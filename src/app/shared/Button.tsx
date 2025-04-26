import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md text-sm text-white bg-accent hover:bg-secondary cursor-pointer active:scale-95 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
