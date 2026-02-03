"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Eye, Copy, Heart, X, User } from "lucide-react";
import { mockPrompts } from "@/lib/data";
import { categories } from "@/lib/categories";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function PromptsPage() {
  const searchParams = useSearchParams();
  const { isFavorited } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );
  const subcategories = selectedCategoryData?.subcategories || [];

  const filteredPrompts = useMemo(() => {
    return mockPrompts.filter((prompt) => {
      if (selectedCategory && prompt.categoryId !== selectedCategory) {
        return false;
      }

      if (selectedSubcategory && prompt.subcategoryId !== selectedSubcategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          prompt.title.toLowerCase().includes(query) ||
          prompt.description.toLowerCase().includes(query)
        );
      }

      if (selectedTools.length > 0) {
        return selectedTools.includes(prompt.targetTool);
      }

      return true;
    });
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedTools]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSearchQuery("");
    setSelectedTools([]);
  };

  const allTools = Array.from(
    new Set(mockPrompts.map((p) => p.targetTool)),
  ).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索提示词..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>筛选</span>
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="card p-4 sticky top-40">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">分类</h3>
                {selectedCategory && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    清除
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === null
                      ? "bg-primary-100 text-primary-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  全部分类
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-100 text-primary-600 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3">
            {selectedCategory && subcategories.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() =>
                      setSelectedSubcategory(
                        selectedSubcategory === sub.id ? null : sub.id,
                      )
                    }
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedSubcategory === sub.id
                        ? "bg-primary-600 text-white"
                        : "bg-primary-100 text-primary-700 hover:bg-primary-200"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">提示词库</h2>
                <p className="text-gray-600 text-sm mt-1">
                  共 {filteredPrompts.length} 个提示词
                </p>
              </div>
            </div>

            {selectedTools.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedTools.map((tool) => (
                  <div
                    key={tool}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700"
                  >
                    <span>{tool}</span>
                    <button
                      onClick={() => toggleTool(tool)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showFilters && (
              <div className="mb-6 card p-4 bg-white">
                <h4 className="font-semibold text-gray-900 mb-3">按工具筛选</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allTools.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => toggleTool(tool)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTools.includes(tool)
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPrompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/prompts/${prompt.id}`}
                    className="card-interactive p-6 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="badge-primary text-xs">
                          {prompt.categoryName}
                        </span>
                        {prompt.subcategoryName && (
                          <span className="text-xs text-gray-500">
                            {prompt.subcategoryName}
                          </span>
                        )}
                      </div>
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFavorited(prompt.id)
                            ? "text-red-500 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {prompt.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {prompt.description}
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                        {prompt.targetTool}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3 text-gray-500 text-sm flex-wrap">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(prompt.viewCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Copy className="w-4 h-4" />
                          <span>{formatNumber(prompt.copyCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{formatNumber(prompt.favoriteCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{prompt.author}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  未找到提示词
                </h3>
                <p className="text-gray-600">尝试调整搜索条件或浏览其他分类</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
