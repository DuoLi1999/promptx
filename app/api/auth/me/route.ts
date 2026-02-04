import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import { updateProfileSchema } from "@/lib/validations/auth";
import {
  successResponse,
  errorResponse,
  unauthorized,
  validationError,
} from "@/lib/api/responses";

// 获取当前用户信息
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return unauthorized();
    }

    return successResponse({
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
    });
  } catch (error) {
    console.error("Get user error:", error);
    return errorResponse("获取用户信息失败", 500);
  }
}

// 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return unauthorized();
    }

    const body = await request.json();

    // 验证输入
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return validationError(result.error.flatten().fieldErrors);
    }

    const updateData = result.data;

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return successResponse({
      id: updatedUser.id,
      email: updatedUser.email,
      phone: updatedUser.phone,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      promptCount: updatedUser.promptCount,
      followers: updatedUser.followers,
      following: updatedUser.following,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse("更新用户资料失败", 500);
  }
}
