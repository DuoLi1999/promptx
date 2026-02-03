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
  id: number;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;

  // 元数据
  outputType: string; // 输出物类型：综述提纲、逐字稿、SQL等
  targetTool: string; // 适用工具：ChatGPT、Claude、Gemini等
  difficulty: "beginner" | "intermediate" | "advanced"; // 难度等级

  // 作者信息
  author: string;
  authorId: number;
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

  // 功能特点
  features?: string[];
  requirements?: string[];
}

// 用户类型
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  joinedAt: string;
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
  outputType?: string;
  targetTool?: string;
  difficulty?: string;
  sortBy?: "newest" | "popular" | "rating";
  keyword?: string;
}

// 难度等级映射
export const DifficultyLabels: Record<string, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "专家",
};

// 工具选项 - 包含国内外主流AI工具
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
  // 图像生成
  "Midjourney",
  "Stable Diffusion",
  "DALL-E",
  // 通用
  "通用",
];
