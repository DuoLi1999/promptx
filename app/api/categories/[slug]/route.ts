import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { successResponse, errorResponse, notFound } from "@/lib/api/responses";

// 获取分类详情
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        subcategories: true,
      },
    });

    if (!category) {
      return notFound("分类");
    }

    return successResponse(category);
  } catch (error) {
    console.error("Get category error:", error);
    return errorResponse("获取分类详情失败", 500);
  }
}
