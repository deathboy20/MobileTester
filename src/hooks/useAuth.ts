"use client";

import type { User } from "@/lib/types";

// Mock implementation of useAuth hook
// In a real app, this would use Firebase Auth and context
export const useAuth = () => {
  const user: User | null = {
    uid: "mock-user-id",
    email: "tester@example.com",
    name: "Alex Tester",
    photoURL: "https://picsum.photos/seed/avatar/100/100",
  };

  const loading = false;

  const login = async () => { console.log("login attempt"); };
  const register = async () => { console.log("register attempt"); };
  const logout = async () => { console.log("logout attempt"); };
  const loginWithGoogle = async () => { console.log("google login attempt"); };

  return { user, loading, login, register, logout, loginWithGoogle };
};
