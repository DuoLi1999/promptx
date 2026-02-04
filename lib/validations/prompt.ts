import { z } from "zod";

// 创建提示词验证
export const createPromptSchema = z.object({
  title: z.string().min(5, "标题至少5个字符").max(100, "标题最多100个字符"),
  description: z
    .string()
    .min(10, "描述至少10个字符")
    .max(500, "描述最多500个字符"),
  content: z
    .string()
    .min(50, "提示词内容至少50个字符")
    .max(10000, "提示词内容最多10000个字符"),
  categoryId: z.string().min(1, "请选择分类"),
  categoryName: z.string().min(1, "分类名称不能为空"),
  subcategoryId: z.string().optional(),
  subcategoryName: z.string().optional(),
  taskType: z.string().min(1, "请选择任务类型"),
  targetTool: z.string().min(1, "请选择目标工具"),
  tags: z
    .array(z.string())
    .min(1, "至少添加一个标签")
    .max(10, "最多添加10个标签"),
  isAICreated: z.boolean().optional().default(false),
});

// 更新提示词验证
export const updatePromptSchema = createPromptSchema.partial();

// 查询提示词验证
export const queryPromptsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  taskType: z.string().optional(),
  targetTool: z.string().optional(),
  sort: z.enum(["newest", "popular", "rating"]).default("newest"),
  featured: z.coerce.boolean().optional(),
  trending: z.coerce.boolean().optional(),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type QueryPromptsInput = z.infer<typeof queryPromptsSchema>;
