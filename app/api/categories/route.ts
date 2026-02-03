import prisma from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api/responses";

// 获取所有分类
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: {
        promptCount: "desc",
      },
    });

    return successResponse(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return errorResponse("获取分类列表失败", 500);
  }
}
