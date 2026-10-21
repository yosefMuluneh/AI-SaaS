"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verify session via secure HttpOnly cookie on mount
  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((userData) => {
        if (isMounted) setUser(userData);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const userData = await loginUser({ email, password: pass });
    setUser(userData);
    router.push("/");
  };

  const register = async (email: string, pass: string) => {
    const userData = await registerUser({ email, password: pass });
    setUser(userData);
    router.push("/onboarding");
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
