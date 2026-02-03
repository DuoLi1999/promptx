import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { successResponse, errorResponse, notFound } from "@/lib/api/responses";

// 记录浏览次数
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
    });

    if (!prompt) {
      return notFound("提示词");
    }

    // 增加浏览次数
    await prisma.prompt.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return successResponse({ message: "浏览记录已更新" });
  } catch (error) {
    console.error("Record view error:", error);
    return errorResponse("记录浏览失败", 500);
  }
}
