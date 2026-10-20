import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && <label className="block text-xs font-bold text-slate-800">{label}</label>}
        <input
          ref={ref}
          suppressHydrationWarning
          className={cn(
            "w-full bg-white border border-slate-400 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all shadow-xs",
            error && "border-rose-600 focus:ring-rose-600",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
