import { getAuthUser } from "@/lib/auth/middleware";
import { unauthorized, serverError, successResponse } from "@/lib/api/responses";
import prisma from "@/lib/db";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// 从数据库获取分类列表并构建 prompt
async function buildCategoryPrompt() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
    orderBy: { name: "asc" },
  });

  let categoryList = "可选的一级分类和对应的二级分类：\n";
  for (const cat of categories) {
    categoryList += `\n【${cat.name}】(id: ${cat.id})\n`;
    categoryList += `  描述: ${cat.description}\n`;
    if (cat.subcategories.length > 0) {
      categoryList += `  二级分类:\n`;
      for (const sub of cat.subcategories) {
        categoryList += `    - ${sub.name} (id: ${sub.id})\n`;
      }
    }
  }
  return { categories, categoryList };
}

function buildSystemPrompt(categoryList: string) {
  return `你是一个专业的提示词分析专家。根据用户提供的提示词内容和原始意图，你需要生成以下元数据信息。

## 重要：分类必须从以下列表中选择

${categoryList}

## 输出要求

请以 JSON 格式返回以下字段：

1. title: 一个简洁、吸引人的标题（5-30个字符），能概括提示词的核心功能
2. description: 简短描述这个提示词的用途和价值（20-100个字符）
3. categoryId: 从上面列表中选择最匹配的一级分类ID
4. categoryName: 对应的一级分类名称
5. subcategoryId: 从上面列表中选择最匹配的二级分类ID（可选，如果有合适的）
6. subcategoryName: 对应的二级分类名称（可选）
7. taskType: 任务类型，只能是 text 或 image（文生文或文生图）
8. targetTool: 目标工具，如：ChatGPT、Claude、DeepSeek、通用等
9. tags: 3-5个相关标签的数组，帮助用户搜索

## 输出格式

请严格按照以下 JSON 格式返回，不要添加任何其他内容：
{
  "title": "标题",
  "description": "描述",
  "categoryId": "一级分类ID",
  "categoryName": "一级分类名称",
  "subcategoryId": "二级分类ID或null",
  "subcategoryName": "二级分类名称或null",
  "taskType": "text",
  "targetTool": "目标工具",
  "tags": ["标签1", "标签2", "标签3"]
}`;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return unauthorized();
    }

    const body = await request.json();
    const { content, intention, targetModel, language } = body;

    if (!content || content.length < 50) {
      return serverError("提示词内容太短");
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "your-deepseek-api-key") {
      return serverError("API Key 未配置");
    }

    // 从数据库获取分类列表
    const { categories, categoryList } = await buildCategoryPrompt();
    const systemPrompt = buildSystemPrompt(categoryList);

    const userMessage = `## 提示词内容
${content.slice(0, 2000)}

## 用户原始意图
${intention}

## 额外信息
- 目标模型偏好: ${targetModel || "通用"}
- 语言: ${language === "en" ? "英文" : "中文"}

请分析这个提示词并生成元数据。务必从给定的分类列表中选择最匹配的分类。`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      console.error("DeepSeek API error:", await response.text());
      return serverError("AI 服务暂时不可用");
    }

    const data = await response.json();
    const resultText = data.choices?.[0]?.message?.content;

    if (!resultText) {
      return serverError("无法生成元数据");
    }

    // 解析 JSON
    let metadata;
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        metadata = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (parseError) {
      console.error("Failed to parse metadata:", resultText);
      // 使用默认值，选择第一个分类
      const defaultCategory = categories[0];
      metadata = {
        title: intention.slice(0, 30),
        description: intention.slice(0, 100),
        categoryId: defaultCategory?.id || "content-creation",
        categoryName: defaultCategory?.name || "内容创作",
        subcategoryId: null,
        subcategoryName: null,
        taskType: "text",
        targetTool: targetModel === "general" ? "通用" : targetModel,
        tags: ["AI", "提示词"],
      };
    }

    // 验证分类是否存在于数据库中
    const validCategory = categories.find((c) => c.id === metadata.categoryId);
    if (!validCategory) {
      // 如果分类不存在，尝试通过名称查找
      const categoryByName = categories.find((c) => c.name === metadata.categoryName);
      if (categoryByName) {
        metadata.categoryId = categoryByName.id;
        metadata.categoryName = categoryByName.name;
      } else {
        // 使用默认分类
        const defaultCat = categories[0];
        metadata.categoryId = defaultCat?.id || "content-creation";
        metadata.categoryName = defaultCat?.name || "内容创作";
      }
    } else {
      // 确保名称一致
      metadata.categoryName = validCategory.name;
    }

    // 验证二级分类
    if (metadata.subcategoryId && validCategory) {
      const validSub = validCategory.subcategories?.find(
        (s: { id: string; name: string }) => s.id === metadata.subcategoryId
      );
      if (!validSub) {
        metadata.subcategoryId = null;
        metadata.subcategoryName = null;
      } else {
        metadata.subcategoryName = validSub.name;
      }
    }

    // 确保 taskType 是有效值
    const validTaskTypes = ["text", "image"];
    if (!validTaskTypes.includes(metadata.taskType)) {
      metadata.taskType = "text";
    }

    // 确保 tags 是数组且有内容
    if (!Array.isArray(metadata.tags) || metadata.tags.length === 0) {
      metadata.tags = ["AI", "提示词", "效率"];
    }

    // 返回格式化后的元数据
    return successResponse({
      title: String(metadata.title || "").slice(0, 100),
      description: String(metadata.description || "").slice(0, 500),
      categoryId: metadata.categoryId,
      categoryName: metadata.categoryName,
      subcategoryId: metadata.subcategoryId || undefined,
      subcategoryName: metadata.subcategoryName || undefined,
      taskType: metadata.taskType || "text",
      targetTool: metadata.targetTool || "通用",
      tags: metadata.tags.slice(0, 10),
    });
  } catch (error) {
    console.error("Metadata generation error:", error);
    return serverError("生成元数据失败");
  }
}
