"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Save, Eye, ArrowLeft, Sparkles, Lock, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/lib/categories";
import { ToolOptions } from "@/types";

export default function CreatePromptPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    categoryId: "",
    subcategoryId: "",
    targetTool: "ChatGPT",
    tags: "",
  });

  // 如果未登录，显示登录提示
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">需要登录</h1>
          <p className="text-gray-600 mb-8">
            发布提示词需要登录账户。请先登录或注册一个新账户。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="btn-primary w-full sm:w-auto">
              登录
            </Link>
            <Link href="/signup" className="btn-outline w-full sm:w-auto">
              注册账户
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 获取当前选中分类的子分类
  const currentCategory = categories.find((c) => c.id === formData.categoryId);
  const subcategories = currentCategory?.subcategories || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 模拟提交
    setTimeout(() => {
      setIsLoading(false);
      alert("提示词发布成功！（演示模式）");
      router.push("/profile");
    }, 1500);
  };

  const isFormValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.content.trim() &&
    formData.categoryId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                发布新提示词
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreview ? "编辑" : "预览"}</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                className="flex items-center gap-2 btn-primary disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>发布中...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>发布</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isPreview ? (
          /* Preview Mode */
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-4">
              {formData.categoryId && (
                <span className="badge-primary">
                  {categories.find((c) => c.id === formData.categoryId)?.name}
                </span>
              )}
              {formData.subcategoryId && (
                <span className="badge-secondary">
                  {
                    subcategories.find((s) => s.id === formData.subcategoryId)
                      ?.name
                  }
                </span>
              )}
              <span className="text-sm text-gray-500">
                {formData.targetTool}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {formData.title || "提示词标题"}
            </h2>
            <p className="text-gray-600 mb-6">
              {formData.description || "提示词描述"}
            </p>
            <div className="bg-gray-900 text-gray-100 rounded-xl p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {formData.content || "提示词内容"}
              </pre>
            </div>
            {formData.tags && (
              <div className="flex flex-wrap gap-2 mt-6">
                {formData.tags.split(",").map((tag, i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                基本信息
              </h2>

              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="为你的提示词起一个清晰的标题"
                    className="input"
                    maxLength={100}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.title.length}/100
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="简要描述这个提示词的用途和效果"
                    rows={3}
                    className="input resize-none"
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/300
                  </p>
                </div>

                {/* Category & Subcategory */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      分类 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">选择分类</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      细分场景
                    </label>
                    <select
                      name="subcategoryId"
                      value={formData.subcategoryId}
                      onChange={handleChange}
                      className="input"
                      disabled={!formData.categoryId}
                    >
                      <option value="">选择细分场景（可选）</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tool & Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      适用工具
                    </label>
                    <select
                      name="targetTool"
                      value={formData.targetTool}
                      onChange={handleChange}
                      className="input"
                    >
                      {ToolOptions.map((tool) => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="用逗号分隔，如: 学术,论文,研究"
                      className="input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  提示词内容
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Info className="w-4 h-4" />
                  <span>支持 Markdown 格式</span>
                </div>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder={`在这里输入你的提示词内容...

例如：
# 角色设定
你是一位专业的...

## 任务
帮助用户...

## 输出格式
...`}
                rows={20}
                className="input resize-none font-mono text-sm"
              />
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">发布技巧</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• 标题要简洁明了，突出提示词的核心功能</li>
                    <li>• 描述中说明适用场景和预期效果</li>
                    <li>• 提示词内容要结构清晰，包含明确的指令</li>
                    <li>• 添加相关标签，方便其他用户发现</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
