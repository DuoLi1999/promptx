import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { encrypt, setToken } from "@/lib/auth/config";
import { registerSchema } from "@/lib/validations/auth";
import {
  successResponse,
  errorResponse,
  validationError,
} from "@/lib/api/responses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return validationError(result.error.flatten().fieldErrors);
    }

    const { email, password, name } = result.data;

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse("该邮箱已被注册", 400);
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 生成头像 URL
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        avatar,
      },
    });

    // 生成 JWT token
    const token = await encrypt({
      userId: user.id,
      email: user.email,
    });

    // 设置 cookie
    await setToken(token);

    // 返回用户信息（不包含密码）
    return successResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          bio: user.bio,
          promptCount: user.promptCount,
          followers: user.followers,
          following: user.following,
          createdAt: user.createdAt,
        },
        token,
      },
      201,
    );
  } catch (error) {
    console.error("Register error:", error);
    return errorResponse("注册失败，请稍后重试", 500);
  }
}
