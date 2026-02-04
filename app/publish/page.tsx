"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  Lock,
  ArrowLeft,
  Loader2,
  Check,
  ChevronDown,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/lib/categories";
import { TaskTypeOptions, ToolOptions } from "@/types";

export default function PublishPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [taskType, setTaskType] = useState("text");
  const [targetTool, setTargetTool] = useState("");
  const [tags, setTags] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  // 获取选中的分类信息
  const selectedCategory = categories.find((c) => c.id === categoryId);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    if (title.length < 5) {
      setError("标题至少5个字符");
      return;
    }
    if (description.length < 10) {
      setError("描述至少10个字符");
      return;
    }
    if (content.length < 50) {
      setError("提示词内容至少50个字符");
      return;
    }
    if (!categoryId) {
      setError("请选择分类");
      return;
    }
    if (!taskType) {
      setError("请选择任务类型");
      return;
    }
    if (!targetTool) {
      setError("请选择目标工具");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (tagsArray.length === 0) {
        tagsArray.push("AI", "提示词");
      }

      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          content,
          categoryId,
          categoryName: selectedCategory?.name || "",
          taskType,
          targetTool,
          tags: tagsArray,
          isAICreated: false,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setPublishedId(data.data.id);
      } else {
        setError(data.error || "发布失败");
      }
    } catch (err) {
      setError("发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 发布成功后的界面
  if (success && publishedId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">发布成功</h1>
          <p className="text-gray-600 mb-8">
            您的提示词已成功发布到 PromptX 平台！
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/prompts/${publishedId}`}
              className="btn-primary w-full sm:w-auto"
            >
              查看提示词
            </Link>
            <Link href="/profile" className="btn-outline w-full sm:w-auto">
              我的发布
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">
                  发布提示词
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-8">
          <p className="text-gray-600 mb-8">
            将您已有的优质提示词发布到平台，与其他用户分享
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给提示词起一个简洁明了的标题"
                className="input"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述这个提示词的用途和价值"
                className="input resize-none"
                rows={2}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提示词内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="粘贴或输入您的提示词内容..."
                className="input resize-none font-mono text-sm"
                rows={12}
                maxLength={10000}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/10000
              </p>
            </div>

            {/* Category & Task Type & Tool */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input appearance-none pr-10"
                    required
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任务类型 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="input appearance-none pr-10"
                    required
                  >
                    {TaskTypeOptions.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标工具 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={targetTool}
                    onChange={(e) => setTargetTool(e.target.value)}
                    className="input appearance-none pr-10"
                    required
                  >
                    <option value="">选择目标工具</option>
                    {ToolOptions.map((tool) => (
                      <option key={tool} value={tool}>
                        {tool}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="用逗号分隔，如：写作,效率,AI"
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                添加标签有助于用户找到您的提示词
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <Link href="/" className="btn-outline">
                取消
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    发布提示词
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-medium text-blue-900 mb-3">发布提示</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>- 标题要简洁明了，能概括提示词的核心功能</li>
            <li>- 描述要说明提示词的用途和价值</li>
            <li>- 提示词内容要完整，可以直接使用</li>
            <li>- 选择正确的分类有助于用户找到您的提示词</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
