"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Voter } from "@/lib/types";
import { authApi } from "@/lib/api";
import { getToken, getRole, getStoredVoter, setAuth, clearAuth } from "@/lib/auth";

interface AuthContextType {
  voter: Voter | null;
  role: "VOTER" | "ADMIN" | null;
  authLoading: boolean;
  signup: (name: string, studentId: string, password: string, imageUrl?: string) => Promise<void>;
  login: (studentId: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [voter, setVoter] = useState<Voter | null>(null);
  const [role, setRole] = useState<"VOTER" | "ADMIN" | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedRole = getRole();
    if (token && storedRole) {
      setRole(storedRole);
      if (storedRole === "VOTER") setVoter(getStoredVoter());
    }
    setAuthLoading(false);
  }, []);

  const signup = async (name: string, studentId: string, password: string, imageUrl?: string) => {
    const res = await authApi.signup({ name, studentId, password, imageUrl });
    setAuth(res.token, "VOTER", res.voter);
    setRole("VOTER");
    setVoter(res.voter);
  };

  const login = async (studentId: string, password: string) => {
    const res = await authApi.login(studentId, password);
    setAuth(res.token, "VOTER", res.voter);
    setRole("VOTER");
    setVoter(res.voter);
  };

  const adminLogin = async (username: string, password: string) => {
    const res = await authApi.adminLogin(username, password);
    setAuth(res.token, "ADMIN");
    setRole("ADMIN");
    setVoter(null);
  };

  const logout = () => {
    clearAuth();
    setRole(null);
    setVoter(null);
  };

  return (
    <AuthContext.Provider value={{ voter, role, authLoading, signup, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
