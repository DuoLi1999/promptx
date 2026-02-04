import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { getAuthUser } from "@/lib/auth/middleware";
import {
  createPromptSchema,
  queryPromptsSchema,
} from "@/lib/validations/prompt";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
  unauthorized,
  validationError,
} from "@/lib/api/responses";

// 获取提示词列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // 解析查询参数
    const queryResult = queryPromptsSchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "12",
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      subcategory: searchParams.get("subcategory") || undefined,
      taskType: searchParams.get("taskType") || undefined,
      targetTool: searchParams.get("targetTool") || undefined,
      sort: searchParams.get("sort") || "newest",
      featured: searchParams.get("featured") || undefined,
      trending: searchParams.get("trending") || undefined,
    });

    if (!queryResult.success) {
      return validationError(queryResult.error.flatten().fieldErrors);
    }

    const {
      page,
      limit,
      search,
      category,
      subcategory,
      taskType,
      targetTool,
      sort,
      featured,
      trending,
    } = queryResult.data;
    const skip = (page - 1) * limit;

    // 构建查询条件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    if (category) {
      where.categoryName = category;
    }

    if (subcategory) {
      where.subcategoryName = subcategory;
    }

    if (taskType) {
      where.taskType = taskType;
    }

    if (targetTool) {
      where.targetTool = targetTool;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (trending) {
      where.isTrending = true;
    }

    // 构建排序
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = { createdAt: "desc" };
    if (sort === "popular") {
      orderBy = { viewCount: "desc" };
    } else if (sort === "rating") {
      orderBy = { rating: "desc" };
    }

    // 查询数据
    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.prompt.count({ where }),
    ]);

    // 转换数据格式
    const formattedPrompts = prompts.map((prompt: (typeof prompts)[0]) => ({
      ...prompt,
      tags: prompt.tags.split(",").filter(Boolean),
      author: prompt.authorName,
      authorAvatar: prompt.authorAvatar,
    }));

    return paginatedResponse(formattedPrompts, total, page, limit);
  } catch (error) {
    console.error("Get prompts error:", error);
    return errorResponse("获取提示词列表失败", 500);
  }
}

// 创建提示词
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const body = await request.json();

    // 验证输入
    const result = createPromptSchema.safeParse(body);
    if (!result.success) {
      return validationError(result.error.flatten().fieldErrors);
    }

    const data = result.data;

    // 创建提示词
    const prompt = await prisma.prompt.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        subcategoryId: data.subcategoryId,
        subcategoryName: data.subcategoryName,
        taskType: data.taskType,
        targetTool: data.targetTool,
        isAICreated: data.isAICreated || false,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar || "",
        tags: data.tags.join(","),
      },
    });

    // 更新用户的 promptCount
    await prisma.user.update({
      where: { id: user.id },
      data: { promptCount: { increment: 1 } },
    });

    // 更新分类的 promptCount
    await prisma.category.updateMany({
      where: { id: data.categoryId },
      data: { promptCount: { increment: 1 } },
    });

    return successResponse(
      {
        ...prompt,
        tags: prompt.tags.split(","),
      },
      201,
    );
  } catch (error) {
    console.error("Create prompt error:", error);
    return errorResponse("创建提示词失败", 500);
  }
}
