import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import { successResponse, unauthorized, errorResponse } from "@/lib/api/responses";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const prompts = await prisma.prompt.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    // 转换 tags 格式
    const formattedPrompts = prompts.map((prompt) => ({
      ...prompt,
      tags: prompt.tags.split(",").filter(Boolean),
    }));

    return successResponse(formattedPrompts);
  } catch (error) {
    console.error("Get user prompts error:", error);
    return errorResponse("获取提示词列表失败", 500);
  }
}
