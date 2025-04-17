import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  cols = 50,
  className = "",
  ...other
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      className={`border text-secondary border-secondary outline-none focus:ring-1 focus:ring-secondary p-2 w-full resize-none rounded-md ${className}`}
      {...other}
    />
  );
};

export { Textarea };
