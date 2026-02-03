"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  Copy,
  Check,
  Share2,
  ChevronRight,
  Clock,
  Tag,
  Lock,
  Heart,
} from "lucide-react";
import { getPromptById, mockPrompts } from "@/lib/data";
import { formatNumber, formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, toggleFavorite, isFavorited } = useAuth();

  const promptId = parseInt(params.id as string);
  const prompt = getPromptById(promptId);
  const favorited = isFavorited(promptId);

  const [copied, setCopied] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] =
    useState("请登录您的账户以复制此提示词内容");

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            未找到该提示词
          </h1>
          <Link href="/prompts" className="btn-primary">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    // 检查是否登录
    if (!isLoggedIn) {
      setLoginPromptMessage("请登录您的账户以复制此提示词内容");
      setShowLoginPrompt(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      setLoginPromptMessage("请登录您的账户以收藏提示词");
      setShowLoginPrompt(true);
      return;
    }
    toggleFavorite(promptId);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // 相关推荐
  const relatedPrompts = mockPrompts
    .filter((p) => p.categoryId === prompt.categoryId && p.id !== prompt.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">需要登录</h3>
              <p className="text-gray-600 mb-6">{loginPromptMessage}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/login")}
                  className="flex-1 btn-primary"
                >
                  立即登录
                </button>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1 btn-outline"
                >
                  稍后再说
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-primary-600">
            首页
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href="/prompts"
            className="text-gray-500 hover:text-primary-600"
          >
            提示词
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Link
            href={`/prompts?category=${prompt.categoryId}`}
            className="text-gray-500 hover:text-primary-600"
          >
            {prompt.categoryName}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {prompt.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="card p-8">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="badge-primary">{prompt.categoryName}</span>
                {prompt.subcategoryName && (
                  <span className="badge-secondary">
                    {prompt.subcategoryName}
                  </span>
                )}
                <span className="badge bg-gray-100 text-gray-700">
                  {prompt.targetTool}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {prompt.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 mb-6">{prompt.description}</p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Eye className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">
                    {formatNumber(prompt.viewCount)}
                  </div>
                  <div className="text-xs text-gray-500">浏览次数</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Copy className="w-5 h-5 text-gray-500 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">
                    {formatNumber(prompt.copyCount)}
                  </div>
                  <div className="text-xs text-gray-500">复制次数</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Tag className="w-4 h-4 text-gray-400" />
                {prompt.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/prompts?q=${tag}`}
                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>更新于 {formatDate(prompt.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">提示词内容</h2>
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : isLoggedIn
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>已复制</span>
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>复制</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>登录后复制</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt Content */}
              <div className="bg-gray-900 text-gray-100 rounded-xl p-6 overflow-x-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {prompt.content}
                </pre>
              </div>
            </div>

            {/* Features & Requirements */}
            {(prompt.features || prompt.requirements) && (
              <div className="card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {prompt.features && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        功能特点
                      </h3>
                      <ul className="space-y-3">
                        {prompt.features.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {prompt.requirements && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        使用说明
                      </h3>
                      <ul className="space-y-3">
                        {prompt.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">创作者</h3>
              <div className="flex items-center space-x-4">
                <Image
                  src={prompt.authorAvatar}
                  alt={prompt.author}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {prompt.author}
                  </div>
                  <div className="text-sm text-gray-500">提示词创作者</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card p-6">
              <div className="space-y-3">
                <button
                  onClick={handleCopy}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : isLoggedIn
                        ? "bg-primary-600 text-white hover:bg-primary-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>已复制到剪贴板</span>
                    </>
                  ) : isLoggedIn ? (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>复制提示词</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>登录后复制</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleFavorite}
                  className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all ${
                    favorited
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${favorited ? "fill-current" : ""}`}
                  />
                  <span>{favorited ? "已收藏" : "收藏"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-4">相关推荐</h3>
                <div className="space-y-4">
                  {relatedPrompts.map((relatedPrompt) => (
                    <Link
                      key={relatedPrompt.id}
                      href={`/prompts/${relatedPrompt.id}`}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                        {relatedPrompt.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{formatNumber(relatedPrompt.viewCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Copy className="w-3 h-3" />
                          <span>{formatNumber(relatedPrompt.copyCount)}</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
