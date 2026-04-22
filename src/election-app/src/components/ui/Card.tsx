"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow duration-150" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
