import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { encrypt, setToken } from "@/lib/auth/config";
import { loginSchema, loginWithPhoneSchema } from "@/lib/validations/auth";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/api/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 判断是邮箱登录还是手机号登录
    const isPhoneLogin = body.phone && !body.email;

    if (isPhoneLogin) {
      // 手机号登录验证
      const result = loginWithPhoneSchema.safeParse(body);
      if (!result.success) {
        return validationError(result.error.flatten().fieldErrors);
      }

      const { phone, password } = result.data;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { phone },
      });

      if (!user) {
        return errorResponse("手机号或密码错误", 401);
      }

      // 验证密码
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return errorResponse("手机号或密码错误", 401);
      }

      // 生成 JWT token
      const token = await encrypt({
        userId: user.id,
        phone: user.phone || undefined,
      });

      // 设置 cookie
      await setToken(token);

      // 返回用户信息（不包含密码）
      return successResponse({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          promptCount: user.promptCount,
          followers: user.followers,
          following: user.following,
          createdAt: user.createdAt,
        },
        token,
      });
    } else {
      // 邮箱登录验证
      const result = loginSchema.safeParse(body);
      if (!result.success) {
        return validationError(result.error.flatten().fieldErrors);
      }

      const { email, password } = result.data;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return errorResponse("邮箱或密码错误", 401);
      }

      // 验证密码
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return errorResponse("邮箱或密码错误", 401);
      }

      // 生成 JWT token
      const token = await encrypt({
        userId: user.id,
        email: user.email || undefined,
      });

      // 设置 cookie
      await setToken(token);

      // 返回用户信息（不包含密码）
      return successResponse({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          promptCount: user.promptCount,
          followers: user.followers,
          following: user.following,
          createdAt: user.createdAt,
        },
        token,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("登录失败，请稍后重试", 500);
  }
}
