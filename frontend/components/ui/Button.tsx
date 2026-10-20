import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  isLoading?: boolean;
}

export function Button({
  className,
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold text-sm rounded-xl px-4 py-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200",
    secondary: "bg-slate-900 hover:bg-slate-800 text-white",
    outline: "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-none",
    danger: "bg-rose-600 hover:bg-rose-700 text-white",
  };

  return (
    <button
      suppressHydrationWarning
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
