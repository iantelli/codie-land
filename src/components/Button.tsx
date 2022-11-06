import React from "react";

export default function Button({
  children,
  onClick,
  className = "",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={
        `inline-flex items-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out active:bg-gray-900 ${
          disabled && "opacity-25"
        } ` + className
      }
      disabled={disabled}
      type="submit"
    >
      {children}
    </button>
  );
}
