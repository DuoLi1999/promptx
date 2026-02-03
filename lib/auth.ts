// 简单的认证模拟系统
import type { User } from "@/types";

// 测试账号
export const testAccount = {
  email: "test@promptx.com",
  password: "test123456",
};

export const testUser: User = {
  id: 100,
  name: "测试用户",
  email: "test@promptx.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=testuser",
  bio: "PromptX 测试账号",
  joinedAt: "2026-01-01",
  promptCount: 0,
  followers: 0,
  following: 0,
};

// 认证状态键
export const AUTH_STORAGE_KEY = "promptx_auth";
export const USER_STORAGE_KEY = "promptx_user";

// 登录函数
export function login(
  email: string,
  password: string,
): { success: boolean; user?: User; error?: string } {
  if (email === testAccount.email && password === testAccount.password) {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(testUser));
    }
    return { success: true, user: testUser };
  }
  return { success: false, error: "邮箱或密码错误" };
}

// 登出函数
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

// 获取当前用户
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}
