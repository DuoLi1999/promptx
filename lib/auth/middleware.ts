import { decrypt, getToken } from "./config";
import prisma from "@/lib/db";
import type { User } from "@prisma/client";

// 获取当前登录用户（可选）
export async function getAuthUser(): Promise<User | null> {
  const token = await getToken();
  if (!token) return null;

  const payload = await decrypt(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  return user;
}

// 要求登录，否则抛出异常
export async function requireAuth(): Promise<User> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

// 检查用户是否有权限操作某个资源
export function checkOwnership(
  resourceAuthorId: string,
  userId: string,
): boolean {
  return resourceAuthorId === userId;
}
