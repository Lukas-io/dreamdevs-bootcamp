"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Box, Home, Settings, Menu, X, LogIn } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: <Home size={15} /> },
  { href: "/items", label: "Items", icon: <Box size={15} /> },
  { href: "/settings", label: "Settings", icon: <Settings size={15} /> },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white shrink-0"
        >
          <Box size={18} className="text-violet-500" />
          <span>My App</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150
                ${isActive(link.href)
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800/50"
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            <LogIn size={13} />
            Sign in
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="sm:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md flex flex-col">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0
                ${isActive(link.href)
                  ? "text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-900"
                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-colors"
          >
            <LogIn size={15} />
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
