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
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LANGUAGES = [
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

interface PromptMetadata {
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  taskType: string;
  targetTool: string;
  tags: string[];
}

export default function PromptOptimizer() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [intention, setIntention] = useState("");
  const [language, setLanguage] = useState("zh");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 发布相关状态
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false);
  const [metadata, setMetadata] = useState<PromptMetadata | null>(null);

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
    setPublishSuccess(false);
    setPublishedId(null);
    setMetadata(null);

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
      let fullResult = "";

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
              fullResult += json.content;
              setResult((prev) => prev + json.content);
            }
          } catch {
            // 忽略解析错误
          }
        }
      }

      // 优化完成后自动生成元数据
      if (fullResult) {
        generateMetadata(fullResult);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      setError(err instanceof Error ? err.message : "优化失败，请重试");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const generateMetadata = async (content: string) => {
    setIsGeneratingMeta(true);
    try {
      const response = await fetch("/api/optimizer/metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          intention: intention.trim(),
          language,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMetadata(data.data);
        }
      }
    } catch {
      console.error("生成元数据失败");
    } finally {
      setIsGeneratingMeta(false);
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

  const handlePublish = async () => {
    if (!result || !metadata) return;

    setIsPublishing(true);
    setError("");

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: metadata.title,
          description: metadata.description,
          content: result,
          categoryId: metadata.categoryId,
          categoryName: metadata.categoryName,
          taskType: metadata.taskType,
          targetTool: metadata.targetTool,
          tags: metadata.tags,
          isAICreated: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPublishSuccess(true);
        setPublishedId(data.data.id);
      } else {
        setError(data.error || "发布失败");
      }
    } catch {
      setError("发布失败，请重试");
    } finally {
      setIsPublishing(false);
    }
  };

  const isFormValid = intention.trim().length >= 10;

  return (
    <section id="optimizer" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Wand2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            AI 提示词优化助手
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            描述您的需求，AI 将为您生成专业、高效的提示词，并支持一键发布到社区
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Area */}
          <div className="space-y-4">
            <div className="card p-6">
              {/* Intention Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述您想要的提示词
                </label>
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="例如：帮我写一个可以分析代码质量的提示词，或者生成一个用于翻译学术论文的提示词..."
                  rows={5}
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

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 mb-4"
              >
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                高级选项
              </button>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      输出语言
                    </label>
                    <div className="flex gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => setLanguage(lang.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            language === lang.value
                              ? "bg-primary-500 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">
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

          {/* Right: Output Area */}
          <div className="card p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">生成结果</h3>
              {result && (
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
              )}
            </div>

            <div className="min-h-[300px] bg-gray-900 rounded-xl p-4 overflow-auto mb-4">
              {isLoading && !result ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">正在生成...</p>
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
                <div className="flex items-center justify-center h-full min-h-[250px]">
                  <div className="text-center text-gray-500">
                    <Wand2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      输入描述后点击生成按钮
                      <br />
                      AI 将为您生成专业的提示词
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Preview */}
            {isGeneratingMeta && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                正在分析提示词...
              </div>
            )}

            {metadata && !isLoading && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  自动生成的信息
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 w-16 shrink-0">标题:</span>
                    <span className="text-gray-900">{metadata.title}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 w-16 shrink-0">分类:</span>
                    <span className="text-gray-900">{metadata.categoryName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 w-16 shrink-0">标签:</span>
                    <div className="flex flex-wrap gap-1">
                      {metadata.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Publish Button */}
            {result && !isLoading && (
              <div className="space-y-3">
                {publishSuccess ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">发布成功！</span>
                    </div>
                    <Link
                      href={`/prompts/${publishedId}`}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      查看详情 →
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || !metadata || isGeneratingMeta}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>发布中...</span>
                      </>
                    ) : isGeneratingMeta ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>正在分析...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>一键发布到社区</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
