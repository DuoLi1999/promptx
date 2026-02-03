import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import {
  successResponse,
  errorResponse,
  unauthorized,
  notFound,
} from "@/lib/api/responses";
import { z } from "zod";

const addFavoriteSchema = z.object({
  promptId: z.string().min(1, "提示词ID不能为空"),
});

// 获取收藏列表
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        prompt: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const prompts = favorites.map((fav: (typeof favorites)[0]) => ({
      ...fav.prompt,
      tags: fav.prompt.tags.split(",").filter(Boolean),
      favoriteId: fav.id,
      favoritedAt: fav.createdAt,
    }));

    return successResponse(prompts);
  } catch (error) {
    console.error("Get favorites error:", error);
    return errorResponse("获取收藏列表失败", 500);
  }
}

// 添加收藏
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const body = await request.json();
    const result = addFavoriteSchema.safeParse(body);

    if (!result.success) {
      return errorResponse("提示词ID不能为空", 400);
    }

    const { promptId } = result.data;

    // 检查提示词是否存在
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });

    if (!prompt) {
      return notFound("提示词");
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId,
        },
      },
    });

    if (existingFavorite) {
      return errorResponse("已经收藏过了", 400);
    }

    // 创建收藏
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        promptId,
      },
    });

    // 更新提示词的收藏数
    await prisma.prompt.update({
      where: { id: promptId },
      data: { favoriteCount: { increment: 1 } },
    });

    return successResponse(favorite, 201);
  } catch (error) {
    console.error("Add favorite error:", error);
    return errorResponse("添加收藏失败", 500);
  }
}
