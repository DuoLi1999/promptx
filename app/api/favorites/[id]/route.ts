import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import {
  successResponse,
  errorResponse,
  unauthorized,
  notFound,
  forbidden,
} from "@/lib/api/responses";

// 取消收藏（通过提示词ID）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    // 查找收藏记录（通过提示词ID）
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: params.id,
        },
      },
    });

    if (!favorite) {
      return notFound("收藏记录");
    }

    if (favorite.userId !== user.id) {
      return forbidden();
    }

    // 删除收藏
    await prisma.favorite.delete({
      where: { id: favorite.id },
    });

    // 更新提示词的收藏数
    await prisma.prompt.update({
      where: { id: params.id },
      data: { favoriteCount: { decrement: 1 } },
    });

    return successResponse({ message: "取消收藏成功" });
  } catch (error) {
    console.error("Remove favorite error:", error);
    return errorResponse("取消收藏失败", 500);
  }
}
