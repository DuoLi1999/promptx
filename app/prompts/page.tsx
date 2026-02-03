"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Eye, Copy, Heart, X } from "lucide-react";
import { mockPrompts } from "@/lib/data";
import { categories } from "@/lib/categories";
import { formatNumber } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { TaskTypeOptions, ToolOptions } from "@/types";

export default function PromptsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isFavorited, toggleFavorite, isLoggedIn } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null,
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
    searchParams.get("subcategory") || null,
  );
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(
    searchParams.get("taskType") || null,
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(
    searchParams.get("tools")?.split(",").filter(Boolean) || [],
  );

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );
  const subcategories = selectedCategoryData?.subcategories || [];
  const selectedTaskTypeLabel =
    TaskTypeOptions.find((type) => type.id === selectedTaskType)?.label || "";

  useEffect(() => {
    const nextCategory = searchParams.get("category") || null;
    const nextSubcategory = searchParams.get("subcategory") || null;
    const nextTaskType = searchParams.get("taskType") || null;
    const nextTools =
      searchParams.get("tools")?.split(",").filter(Boolean) || [];

    setSelectedCategory(nextCategory);
    setSelectedSubcategory(nextSubcategory);
    setSelectedTaskType(nextTaskType);
    setSelectedTools(nextTools);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedSubcategory) params.set("subcategory", selectedSubcategory);
    if (selectedTaskType) params.set("taskType", selectedTaskType);
    if (selectedTools.length > 0) params.set("tools", selectedTools.join(","));

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (nextQuery !== currentQuery) {
      router.replace(`${pathname}${nextQuery ? `?${nextQuery}` : ""}`, {
        scroll: false,
      });
    }
  }, [
    pathname,
    router,
    searchParams,
    selectedCategory,
    selectedSubcategory,
    selectedTaskType,
    selectedTools,
  ]);

  const filteredPrompts = useMemo(() => {
    return mockPrompts.filter((prompt) => {
      if (selectedCategory && prompt.categoryId !== selectedCategory) {
        return false;
      }

      if (selectedSubcategory && prompt.subcategoryId !== selectedSubcategory) {
        return false;
      }

      if (selectedTaskType && prompt.taskType !== selectedTaskType) {
        return false;
      }

      if (
        selectedTools.length > 0 &&
        !selectedTools.includes(prompt.targetTool)
      ) {
        return false;
      }

      return true;
    });
  }, [selectedCategory, selectedSubcategory, selectedTaskType, selectedTools]);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    promptId: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    toggleFavorite(promptId);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTaskType(null);
    setSelectedTools([]);
  };

  const allTools = ToolOptions;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="card p-4 sticky top-40 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">筛选</h3>
                {(selectedCategory ||
                  selectedSubcategory ||
                  selectedTaskType ||
                  selectedTools.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    清除
                  </button>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    任务类型
                  </h4>
                  {selectedTaskType ? (
                    <button
                      onClick={() => setSelectedTaskType(null)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      清除
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">单选</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TaskTypeOptions.map((type) => (
                    <button
                      key={type.id}
                      onClick={() =>
                        setSelectedTaskType(
                          selectedTaskType === type.id ? null : type.id,
                        )
                      }
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTaskType === type.id
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">分类</h4>
                  <span className="text-xs text-gray-400">可滚动</span>
                </div>
                <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                    }}
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
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(null);
                      }}
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    模型选择
                  </h4>
                  <span className="text-xs text-gray-400">
                    {selectedTools.length} 已选
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto pr-1 space-y-2">
                  {allTools.map((tool) => (
                    <label
                      key={tool}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTools.includes(tool)}
                        onChange={() => toggleTool(tool)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span>{tool}</span>
                    </label>
                  ))}
                </div>
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

            {(selectedTaskType || selectedTools.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedTaskType && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                    <span>{selectedTaskTypeLabel}</span>
                    <button
                      onClick={() => setSelectedTaskType(null)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
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
                      <button
                        type="button"
                        aria-label={isFavorited(prompt.id) ? "取消收藏" : "收藏"}
                        onClick={(e) => handleFavoriteClick(e, prompt.id)}
                        className={`p-1 rounded-full transition-colors ${
                          isFavorited(prompt.id)
                            ? "text-red-500"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isFavorited(prompt.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
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
                      </div>
                      <div className="flex items-center">
                        <Image
                          src={prompt.authorAvatar}
                          alt={prompt.author}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full"
                        />
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
                <p className="text-gray-600">尝试调整筛选条件或浏览其他分类</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
