"use client";

import { useState } from "react";
import { useTheme } from "@/components/layout/ThemeProvider";
import { ImageInput } from "@/components/ui/ImageInput";
import { useToast } from "@/components/ui/ToastProvider";
import { MOCK_USERS } from "@/lib/mock";

const defaultUser = MOCK_USERS[0];

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [name, setName] = useState(defaultUser.name);
  const [email, setEmail] = useState(defaultUser.email);
  const [imageUrl, setImageUrl] = useState(defaultUser.imageUrl ?? "");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    addToast("Settings saved.", "success");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Profile</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Avatar (optional)</label>
            <ImageInput value={imageUrl} onChange={setImageUrl} />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Preferences</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Dark mode</p>
            <p className="text-xs text-neutral-400 mt-0.5">Currently {theme === "dark" ? "on" : "off"}</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
              ${theme === "dark" ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-700"}`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform
                ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Notifications</p>
            <p className="text-xs text-neutral-400 mt-0.5">Receive email updates</p>
          </div>
          <button
            onClick={() => setNotifications((n) => !n)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer
              ${notifications ? "bg-violet-600" : "bg-neutral-200 dark:bg-neutral-700"}`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                ${notifications ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      </section>

      <button
        onClick={handleSave}
        className="self-start px-4 py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
      >
        Save changes
      </button>
    </div>
  );
}
