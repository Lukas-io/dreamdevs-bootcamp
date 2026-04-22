"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Trophy, Users, Vote, BarChart, Home } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { href: "/", label: "Home", icon: <Home size={15} /> },
  { href: "/awards", label: "Awards", icon: <Trophy size={15} /> },
  { href: "/voters", label: "Voters", icon: <Users size={15} /> },
  { href: "/vote", label: "Vote", icon: <Vote size={15} /> },
  { href: "/results", label: "Results", icon: <BarChart size={15} /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white shrink-0"
        >
          <Trophy size={18} className="text-violet-500" />
          <span>Class Awards</span>
        </Link>

        <nav className="flex items-center gap-1 flex-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150
                  ${active
                    ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
