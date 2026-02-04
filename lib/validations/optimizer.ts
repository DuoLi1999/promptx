import { z } from "zod";

export const optimizePromptSchema = z.object({
  intention: z
    .string()
    .min(10, "请描述您的意图，至少10个字符")
    .max(2000, "意图描述最多2000个字符"),
  targetModel: z
    .enum(["chatgpt", "claude", "deepseek", "general"])
    .optional()
    .default("general"),
  language: z.enum(["zh", "en"]).optional().default("zh"),
});

export type OptimizePromptInput = z.infer<typeof optimizePromptSchema>;
