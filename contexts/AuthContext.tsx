"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string;
  avatar: string | null;
  bio: string | null;
  promptCount: number;
  followers: number;
  following: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string,
    type: "email" | "phone",
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    identifier: string,
    password: string,
    name: string,
    type: "email" | "phone",
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  favorites: string[];
  toggleFavorite: (promptId: string) => Promise<void>;
  isFavorited: (promptId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // 获取收藏列表
  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFavorites(data.data.map((p: { id: string }) => p.id));
        }
      }
    } catch {
      console.error("Failed to fetch favorites");
    }
  };

  // 获取当前用户信息
  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
          setIsLoggedIn(true);
          // 获取收藏列表
          await fetchFavorites();
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch {
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // 登录
  const login = async (identifier: string, password: string, type: "email" | "phone") => {
    try {
      const body = type === "email"
        ? { email: identifier, password }
        : { phone: identifier, password };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setIsLoggedIn(true);
        await fetchFavorites();
        return { success: true };
      } else {
        return { success: false, error: data.error || "登录失败" };
      }
    } catch {
      return { success: false, error: "网络错误，请稍后重试" };
    }
  };

  // 注册
  const register = async (identifier: string, password: string, name: string, type: "email" | "phone") => {
    try {
      const body = type === "email"
        ? { email: identifier, password, name }
        : { phone: identifier, password, name };

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, error: data.error || "注册失败" };
      }
    } catch {
      return { success: false, error: "网络错误，请稍后重试" };
    }
  };

  // 退出登录
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      console.error("Logout error");
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setFavorites([]);
    }
  };

  // 切换收藏
  const toggleFavorite = async (promptId: string) => {
    if (!isLoggedIn) return;

    const isFav = favorites.includes(promptId);

    try {
      if (isFav) {
        // 取消收藏
        const response = await fetch(`/api/favorites/${promptId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setFavorites((prev) => prev.filter((id) => id !== promptId));
        }
      } else {
        // 添加收藏
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId }),
        });
        if (response.ok) {
          setFavorites((prev) => [...prev, promptId]);
        }
      }
    } catch {
      console.error("Toggle favorite error");
    }
  };

  // 检查是否已收藏
  const isFavorited = (promptId: string) => {
    return favorites.includes(promptId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
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
