import Link from "next/link";
import {
  Microscope,
  Video,
  BarChart3,
  PenTool,
  Code,
  Megaphone,
  Briefcase,
  Palette,
  BookOpen,
  ShoppingBag,
  Heart,
  Music,
  TrendingUp,
  Headphones,
  Users,
  Calculator,
  Scale,
  ClipboardList,
  Lightbulb,
  Rocket,
  Globe,
} from "lucide-react";
import { categories } from "@/lib/categories";
import { mockPrompts } from "@/lib/data";

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Microscope,
  Video,
  BarChart: BarChart3,
  PenTool,
  Code,
  Megaphone,
  Briefcase,
  Palette,
  BookOpen,
  ShoppingBag,
  Heart,
  Music,
  TrendingUp,
  Headphones,
  Users,
  Calculator,
  Scale,
  ClipboardList,
  Lightbulb,
  Rocket,
  Globe,
};

// 统计每个分类的实际提示词数量
function getCategoryPromptCount(categoryId: string): number {
  return mockPrompts.filter((prompt) => prompt.categoryId === categoryId)
    .length;
}

export default function Categories() {
  // 只展示前12个主要分类
  const displayCategories = categories.slice(0, 12);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">按职业分类浏览</h2>
          <p className="section-description max-w-2xl mx-auto">
            我们为 20+ 不同职业和领域精心策划了专业的 Prompt 库
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category) => {
            const IconComponent = iconMap[category.icon] || Briefcase;
            const actualCount = getCategoryPromptCount(category.id);
            return (
              <Link
                key={category.id}
                href={`/prompts?category=${encodeURIComponent(category.name)}`}
                className="card-interactive p-6 group"
              >
                <div
                  className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{actualCount} 个提示词</p>
              </Link>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/prompts"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
          >
            浏览全部提示词
            <svg
              className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
