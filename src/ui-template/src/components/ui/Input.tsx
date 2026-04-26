"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border rounded-lg outline-none transition-colors duration-150
          ${error ? "border-red-400 focus:border-red-500" : "border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-500"}
          text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
