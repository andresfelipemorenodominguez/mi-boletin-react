import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export function Button({
  children,
  className = '',
  isLoading = false,
  variant = 'primary',
  fullWidth = true,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";
  
  const variants = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "text-white bg-slate-700 hover:bg-slate-600 focus:ring-slate-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
