"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ImageInput } from "@/components/ui/ImageInput";
import { Trophy, Eye, EyeOff } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

type Tab = "signup" | "login" | "admin";

function LoginContent() {
  const { voter, role, authLoading, signup, login, adminLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const defaultTab = (searchParams.get("tab") as Tab) ?? "login";

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // signup fields
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // admin fields
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  useEffect(() => {
    if (!authLoading && (voter || role === "ADMIN")) {
      router.replace(redirect);
    }
  }, [authLoading, voter, role]);

  if (authLoading) {
    return <div className="flex justify-center py-32"><Spinner size={28} /></div>;
  }

  const handleSignup = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    if (!studentId.trim()) { setError("Student ID is required."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    setLoading(true);
    setError("");
    try {
      await signup(name.trim(), studentId.trim(), password, imageUrl.trim() || undefined);
      router.replace(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!studentId.trim()) { setError("Student ID is required."); return; }
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    setError("");
    try {
      await login(studentId.trim(), password);
      router.replace(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminUsername.trim()) { setError("Username is required."); return; }
    if (!adminPassword) { setError("Password is required."); return; }
    setLoading(true);
    setError("");
    try {
      await adminLogin(adminUsername.trim(), adminPassword);
      router.replace(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError("");
    setStudentId("");
    setPassword("");
    setName("");
    setImageUrl("");
    setAdminUsername("");
    setAdminPassword("");
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "login", label: "Log In" },
    { key: "signup", label: "Sign Up" },
  ];

  const passwordField = (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(""); }}
        placeholder="Password"
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
            <Trophy size={22} className="text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Class Awards</h1>
          <p className="text-sm text-neutral-500">Sign in to cast your vote</p>
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
            {tab === "signup" && (
              <>
                <input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="Full name"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                <input
                  value={studentId}
                  onChange={(e) => { setStudentId(e.target.value); setError(""); }}
                  placeholder="Student ID"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                {passwordField}
                <div>
                  <p className="text-xs text-neutral-500 mb-1.5">Profile photo (optional)</p>
                  <ImageInput
                    value={imageUrl}
                    onChange={setImageUrl}
                    prompt={name.trim() ? `${name.trim()} student portrait` : undefined}
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </>
            )}

            {tab === "login" && (
              <>
                <input
                  value={studentId}
                  onChange={(e) => { setStudentId(e.target.value); setError(""); }}
                  placeholder="Student ID"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                {passwordField}
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
                <p className="text-center text-xs text-neutral-400">
                  No account?{" "}
                  <button onClick={() => switchTab("signup")} className="text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">
                    Sign up
                  </button>
                </p>
              </>
            )}

            {tab === "admin" && (
              <>
                <input
                  value={adminUsername}
                  onChange={(e) => { setAdminUsername(e.target.value); setError(""); }}
                  placeholder="Admin username"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg outline-none focus:border-neutral-400 dark:focus:border-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setError(""); }}
                    placeholder="Admin password"
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
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleAdminLogin}
                  disabled={loading}
                  className="w-full py-2.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in…" : "Admin Sign In"}
                </button>
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
