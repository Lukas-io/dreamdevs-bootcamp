"use client";

import { useState, Suspense } from "react";
import { Box, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";

type Tab = "login" | "signup";

function LoginContent() {
  const { addToast } = useToast();
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);

  // login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // signup fields
  const [signupName, setSignupName] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setLoginUsername("");
    setLoginPassword("");
    setSignupName("");
    setSignupUsername("");
    setSignupPassword("");
  };

  const handleLogin = () => {
    if (!loginUsername.trim()) { setError("Username is required."); return; }
    if (!loginPassword) { setError("Password is required."); return; }
    addToast("This is a UI template — wire up your own auth endpoint.", "info");
    setError("");
  };

  const handleSignup = () => {
    if (!signupName.trim()) { setError("Name is required."); return; }
    if (!signupUsername.trim()) { setError("Username is required."); return; }
    if (signupPassword.length < 4) { setError("Password must be at least 4 characters."); return; }
    addToast("This is a UI template — wire up your own auth endpoint.", "info");
    setError("");
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "login", label: "Log In" },
    { key: "signup", label: "Sign Up" },
  ];

  const passwordField = (value: string, onChange: (v: string) => void, placeholder = "Password") => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => { onChange(e.target.value); setError(""); }}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword((p) => !p)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Box size={22} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">My App</h1>
          <p className="text-sm text-neutral-500">Sign in to continue</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="flex border-b border-neutral-100 dark:border-neutral-800">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => switchTab(t.key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors cursor-pointer
                  ${tab === t.key
                    ? "text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-800"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 flex flex-col gap-4">
            {tab === "login" && (
              <>
                <input
                  value={loginUsername}
                  onChange={(e) => { setLoginUsername(e.target.value); setError(""); }}
                  placeholder="Username"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                {passwordField(loginPassword, setLoginPassword)}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleLogin}
                  className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Sign In
                </button>
                <p className="text-center text-xs text-neutral-400">
                  No account?{" "}
                  <button onClick={() => switchTab("signup")} className="text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
                    Sign up
                  </button>
                </p>
              </>
            )}

            {tab === "signup" && (
              <>
                <input
                  value={signupName}
                  onChange={(e) => { setSignupName(e.target.value); setError(""); }}
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                <input
                  value={signupUsername}
                  onChange={(e) => { setSignupUsername(e.target.value); setError(""); }}
                  placeholder="Username"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                {passwordField(signupPassword, setSignupPassword)}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleSignup}
                  className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Create Account
                </button>
                <p className="text-center text-xs text-neutral-400">
                  Already have an account?{" "}
                  <button onClick={() => switchTab("login")} className="text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-32"><Spinner size={28} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
