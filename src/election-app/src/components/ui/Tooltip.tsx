import { ReactNode } from "react";

const posClass = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: keyof typeof posClass;
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  return (
    <div className="group/tooltip relative inline-flex">
      {children}
      <div
        className={`invisible opacity-0 group-hover/tooltip:visible group-hover/tooltip:opacity-100 absolute z-50 px-2.5 py-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded-lg pointer-events-none max-w-[220px] text-center leading-relaxed shadow-lg transition-opacity duration-150 ${posClass[position]}`}
      >
        {content}
      </div>
    </div>
  );
}
