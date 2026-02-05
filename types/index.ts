// PromptX 类型定义

// 分类系统 - 基于category.txt的完整分类体系
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
  promptCount: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

// Prompt 类型
export interface Prompt {
  id: number | string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  taskType: TaskType;

  // 元数据
  outputType?: string; // 输出物类型：综述提纲、逐字稿、SQL等
  targetTool: string; // 适用工具：ChatGPT、Claude、Gemini等

  // 作者信息
  author: string;
  authorId: number | string;
  authorAvatar: string;

  // 标签
  tags: string[];

  // 统计数据
  viewCount: number;
  favoriteCount: number;
  copyCount: number;
  rating: number;
  reviewCount: number;

  // 时间戳
  createdAt: string;
  updatedAt: string;

  // 状态
  isFeatured?: boolean;
  isTrending?: boolean;
  isAICreated?: boolean; // 是否AI创作

  // 功能特点
  features?: string[];
  requirements?: string[];
}

// 用户类型
export interface User {
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  bio?: string;
  joinedAt?: string;
  createdAt?: string;
  promptCount: number;
  followers: number;
  following: number;
}

export interface UserProfile extends User {
  favoritePrompts: number[];
  publishedPrompts: number[];
}

// 筛选器类型
export interface FilterOptions {
  category?: string;
  subcategory?: string;
  taskType?: TaskType;
  outputType?: string;
  targetTool?: string;
  sortBy?: "newest" | "popular" | "rating";
  keyword?: string;
}

// 任务类型 - 简化为文生文和文生图
export type TaskType = "text" | "image";

export const TaskTypeOptions: Array<{ id: TaskType; label: string }> = [
  { id: "text", label: "文生文" },
  { id: "image", label: "文生图" },
];

// 工具选项 - 包含国内外主流AI工具
// 文生文工具
export const TextToolOptions = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
  "Perplexity",
  "DeepSeek",
  "豆包",
  "元宝",
  "通义千问",
  "文心一言",
  "Kimi",
  "智谱清言",
  "讯飞星火",
  "混元",
  "通用",
  "其他",
];

// 文生图工具 - 包含专用图像模型和多模态模型
export const ImageToolOptions = [
  // 专用图像生成模型
  "Midjourney",
  "Stable Diffusion",
  "DALL-E",
  "Flux",
  "Leonardo AI",
  "Adobe Firefly",
  // 多模态模型（也支持生图）
  "ChatGPT",
  "Gemini",
  "通义千问",
  "文心一言",
  "豆包",
  "智谱清言",
  "通用",
  "其他",
];

// 全部工具（用于未选择任务类型时）
export const ToolOptions = [
  // 国际主流
  "ChatGPT",
  "Claude",
  "Gemini",
  "Copilot",
  "Perplexity",
  // 国产主流
  "DeepSeek",
  "豆包",
  "元宝",
  "通义千问",
  "文心一言",
  "Kimi",
  "智谱清言",
  "讯飞星火",
  "混元",
  // 图像生成专用
  "Midjourney",
  "Stable Diffusion",
  "DALL-E",
  "Flux",
  "Leonardo AI",
  "Adobe Firefly",
  // 通用
  "通用",
  "其他",
];

// 根据任务类型获取对应工具列表
export function getToolsByTaskType(taskType: string | null): string[] {
  if (taskType === "text") return TextToolOptions;
  if (taskType === "image") return ImageToolOptions;
  return ToolOptions;
}
