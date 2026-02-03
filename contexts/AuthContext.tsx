"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/types";
import {
  login as authLogin,
  logout as authLogout,
  isAuthenticated,
  getCurrentUser,
  testAccount,
} from "@/lib/auth";

const FAVORITES_STORAGE_KEY = "promptx_favorites";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  testCredentials: { email: string; password: string };
  favorites: number[];
  toggleFavorite: (promptId: number) => void;
  isFavorited: (promptId: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    // 初始化时检查认证状态
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);

      // 加载收藏列表
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch {
          setFavorites([]);
        }
      }
    }
  }, []);

  const login = (email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsLoggedIn(true);

      // 加载收藏列表
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch {
          setFavorites([]);
        }
      }

      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsLoggedIn(false);
    setFavorites([]);
  };

  const toggleFavorite = (promptId: number) => {
    if (!isLoggedIn) return;

    setFavorites((prev) => {
      const newFavorites = prev.includes(promptId)
        ? prev.filter((id) => id !== promptId)
        : [...prev, promptId];

      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorited = (promptId: number) => {
    return favorites.includes(promptId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        testCredentials: testAccount,
        favorites,
        toggleFavorite,
        isFavorited,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
