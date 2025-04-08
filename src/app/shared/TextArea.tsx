import React from "react";

interface TextareaProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  rows?: number;
  cols?: number;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  cols = 50,
  className = "",
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      className={`border p-2 w-full resize-none ${className}`}
    />
  );
};

export { Textarea };
