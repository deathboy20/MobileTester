"use client";

// This file is deprecated and will be removed.
// Please use `import { useUser } from "@/firebase"` instead.

import type { User } from "firebase/auth";

// Mock implementation of useAuth hook
// In a real app, this would use Firebase Auth and context
export const useAuth = () => {
  const user: User | null = null;
  const loading = true;

  const login = async () => { console.log("login attempt"); };
  const register = async () => { console.log("register attempt"); };
  const logout = async () => { console.log("logout attempt"); };
  const loginWithGoogle = async () => { console.log("google login attempt"); };

  return { user, loading, login, register, logout, loginWithGoogle };
};
