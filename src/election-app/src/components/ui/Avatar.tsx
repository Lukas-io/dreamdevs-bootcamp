interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { outer: "w-6 h-6", text: "text-[9px]" },
  md: { outer: "w-9 h-9", text: "text-xs" },
  lg: { outer: "w-12 h-12", text: "text-sm" },
};

export function Avatar({ name, imageUrl, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const { outer, text } = sizeMap[size];

  if (imageUrl) {
    return (
      <div className={`${outer} rounded-full overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800`}>
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${outer} rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0`}>
      <span className={`${text} font-semibold text-violet-600 dark:text-violet-400`}>{initials}</span>
    </div>
  );
}
