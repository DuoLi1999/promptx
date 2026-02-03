import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import { checkOwnership } from "@/lib/auth/middleware";
import { updatePromptSchema } from "@/lib/validations/prompt";
import {
  successResponse,
  errorResponse,
  notFound,
  unauthorized,
  forbidden,
  validationError,
} from "@/lib/api/responses";

// 获取提示词详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            promptCount: true,
          },
        },
      },
    });

    if (!prompt) {
      return notFound("提示词");
    }

    // 检查当前用户是否收藏了这个提示词
    const user = await getAuthUser();
    let isFavorited = false;

    if (user) {
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_promptId: {
            userId: user.id,
            promptId: params.id,
          },
        },
      });
      isFavorited = !!favorite;
    }

    return successResponse({
      ...prompt,
      tags: prompt.tags.split(",").filter(Boolean),
      isFavorited,
    });
  } catch (error) {
    console.error("Get prompt error:", error);
    return errorResponse("获取提示词详情失败", 500);
  }
}

// 更新提示词
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return notFound("提示词");
    }

    if (!checkOwnership(prompt.authorId, user.id)) {
      return forbidden();
    }

    const body = await request.json();

    // 验证输入
    const result = updatePromptSchema.safeParse(body);
    if (!result.success) {
      return validationError(result.error.flatten().fieldErrors);
    }

    const data = result.data;

    // 更新提示词
    const updatedPrompt = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        ...data,
        tags: data.tags ? data.tags.join(",") : undefined,
      },
    });

    return successResponse({
      ...updatedPrompt,
      tags: updatedPrompt.tags.split(","),
    });
  } catch (error) {
    console.error("Update prompt error:", error);
    return errorResponse("更新提示词失败", 500);
  }
}

// 删除提示词
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return notFound("提示词");
    }

    if (!checkOwnership(prompt.authorId, user.id)) {
      return forbidden();
    }

    // 删除提示词
    await prisma.prompt.delete({
      where: { id: params.id },
    });

    // 更新用户的 promptCount
    await prisma.user.update({
      where: { id: user.id },
      data: { promptCount: { decrement: 1 } },
    });

    // 更新分类的 promptCount
    await prisma.category.updateMany({
      where: { id: prompt.categoryId },
      data: { promptCount: { decrement: 1 } },
    });

    return successResponse({ message: "删除成功" });
  } catch (error) {
    console.error("Delete prompt error:", error);
    return errorResponse("删除提示词失败", 500);
  }
}
