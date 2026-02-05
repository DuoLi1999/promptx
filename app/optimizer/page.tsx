"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  X,
  Wand2,
  ArrowLeft,
  Send,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { categories } from "@/lib/categories";
import { TaskTypeOptions, ToolOptions, getToolsByTaskType } from "@/types";

const LANGUAGES = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

export default function OptimizerPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [intention, setIntention] = useState("");
  const [language, setLanguage] = useState("zh");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  // 发布相关状态
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishCategoryId, setPublishCategoryId] = useState("");
  const [publishTaskType, setPublishTaskType] = useState("text");
  const [publishTargetTool, setPublishTargetTool] = useState("");
  const [publishCustomTool, setPublishCustomTool] = useState("");
  const [publishTags, setPublishTags] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [publishError, setPublishError] = useState("");

  const handleOptimize = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (intention.trim().length < 10) {
      setError("请描述您的意图，至少10个字符");
      return;
    }

    setError("");
    setResult("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/optimizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intention: intention.trim(),
          language,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "请求失败");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("无法读取响应流");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine === "data: [DONE]") continue;
          if (!trimmedLine.startsWith("data: ")) continue;

          try {
            const json = JSON.parse(trimmedLine.slice(6));
            if (json.content) {
              setResult((prev) => prev + json.content);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // 用户取消了请求
        return;
      }
      setError(err instanceof Error ? err.message : "优化失败，请重试");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("复制失败，请手动复制");
    }
  };

  const handleOpenPublish = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setShowPublishModal(true);
    setPublishError("");

    // Auto-generate metadata using AI
    if (result.length >= 50) {
      setIsGeneratingMeta(true);
      try {
        const res = await fetch("/api/optimizer/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: result,
            intention,
            language,
          }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          setPublishTitle(data.data.title || "");
          setPublishDescription(data.data.description || "");
          setPublishCategoryId(data.data.categoryId || "");
          setPublishTaskType(data.data.taskType || "text");
          setPublishTargetTool(data.data.targetTool || "通用");
          setPublishTags((data.data.tags || []).join(", "));
        }
      } catch (err) {
        console.error("Failed to generate metadata:", err);
      } finally {
        setIsGeneratingMeta(false);
      }
    }
  };

  const handlePublish = async () => {
    if (publishTitle.length < 5) {
      setPublishError("标题至少5个字符");
      return;
    }
    if (publishDescription.length < 10) {
      setPublishError("描述至少10个字符");
      return;
    }
    if (!publishCategoryId) {
      setPublishError("请选择分类");
      return;
    }
    if (!publishTaskType) {
      setPublishError("请选择任务类型");
      return;
    }
    if (!publishTargetTool) {
      setPublishError("请选择目标工具");
      return;
    }
    if (publishTargetTool === "其他" && !publishCustomTool.trim()) {
      setPublishError("请输入自定义工具名称");
      return;
    }

    setIsPublishing(true);
    setPublishError("");

    try {
      const selectedCategory = categories.find((c) => c.id === publishCategoryId);
      const tagsArray = publishTags
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
          title: publishTitle,
          description: publishDescription,
          content: result,
          categoryId: publishCategoryId,
          categoryName: selectedCategory?.name || "",
          taskType: publishTaskType,
          targetTool: publishTargetTool === "其他" ? publishCustomTool.trim() : publishTargetTool,
          tags: tagsArray,
          isAICreated: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/prompts/${data.data.id}`);
      } else {
        setPublishError(data.error || "发布失败");
      }
    } catch {
      setPublishError("发布失败，请重试");
    } finally {
      setIsPublishing(false);
    }
  };

  const isFormValid = intention.trim().length >= 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-gray-900">
                  AI创作助手
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Area */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                描述您的需求
              </h2>

              <div className="space-y-6">
                {/* Intention */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    意图描述 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="请描述您想要实现的目标，例如：&#10;- 帮我写一个可以分析代码质量的提示词&#10;- 我需要一个能够模拟面试官的 AI 助手&#10;- 生成一个用于翻译学术论文的提示词"
                    rows={8}
                    className="input resize-none"
                    maxLength={2000}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {intention.length < 10 && intention.length > 0
                        ? "至少需要10个字符"
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {intention.length}/2000
                    </p>
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输出语言
                  </label>
                  <div className="flex gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setLanguage(lang.value)}
                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          language === lang.value
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={isLoading ? handleCancel : handleOptimize}
                  disabled={!isFormValid && !isLoading}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                    isLoading
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "btn-primary disabled:opacity-50"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>取消生成</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>生成提示词</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-purple-900 mb-2">创作技巧</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>- 描述越详细，生成的提示词越精准</li>
                    <li>- 说明具体的使用场景和期望输出</li>
                    <li>- 可以指定角色、风格或格式要求</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Output Area */}
          <div className="card p-6 h-fit lg:sticky lg:top-36">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
              {result && !isLoading && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>复制</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleOpenPublish}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>发布</span>
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[400px] bg-gray-900 rounded-xl p-6 overflow-auto">
              {isLoading && !result ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">正在生成提示词...</p>
                  </div>
                </div>
              ) : result ? (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-100 leading-relaxed">
                  {result}
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-primary-400 ml-0.5 animate-pulse" />
                  )}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Wand2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      输入您的意图，点击生成按钮
                      <br />
                      AI 将为您创作专业的提示词
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">发布提示词</h2>
                <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  AI创作
                </span>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {isGeneratingMeta ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary-500 animate-spin mr-3" />
                  <span className="text-gray-600">正在自动生成元信息...</span>
                </div>
              ) : (
                <>
                  {publishError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {publishError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标题 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={publishTitle}
                      onChange={(e) => setPublishTitle(e.target.value)}
                      className="input"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={publishDescription}
                      onChange={(e) => setPublishDescription(e.target.value)}
                      className="input resize-none"
                      rows={2}
                      maxLength={500}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分类 <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={publishCategoryId}
                          onChange={(e) => setPublishCategoryId(e.target.value)}
                          className="input appearance-none pr-10"
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
                          value={publishTaskType}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setPublishTaskType(newType);
                            const validTools = getToolsByTaskType(newType);
                            if (publishTargetTool && !validTools.includes(publishTargetTool)) {
                              setPublishTargetTool("");
                              setPublishCustomTool("");
                            }
                          }}
                          className="input appearance-none pr-10"
                        >
                          {TaskTypeOptions.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.label}
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
                          value={publishTargetTool}
                          onChange={(e) => {
                            setPublishTargetTool(e.target.value);
                            if (e.target.value !== "其他") {
                              setPublishCustomTool("");
                            }
                          }}
                          className="input appearance-none pr-10"
                        >
                          <option value="">选择工具</option>
                          {getToolsByTaskType(publishTaskType).map((tool) => (
                            <option key={tool} value={tool}>
                              {tool}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                      {publishTargetTool === "其他" && (
                        <input
                          type="text"
                          value={publishCustomTool}
                          onChange={(e) => setPublishCustomTool(e.target.value)}
                          placeholder="请输入工具名称"
                          className="input mt-2"
                          maxLength={50}
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      标签
                    </label>
                    <input
                      type="text"
                      value={publishTags}
                      onChange={(e) => setPublishTags(e.target.value)}
                      className="input"
                      placeholder="用逗号分隔"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowPublishModal(false)}
                className="btn-outline"
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing || isGeneratingMeta}
                className="btn-primary flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    确认发布
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
