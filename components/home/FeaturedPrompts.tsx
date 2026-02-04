"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, Copy, ArrowRight, Sparkles } from "lucide-react";
import { formatNumber, truncateText } from "@/lib/utils";

interface PromptData {
  id: string;
  title: string;
  description: string;
  categoryName: string;
  tags: string[];
  viewCount: number;
  favoriteCount: number;
  copyCount: number;
  authorName: string;
  authorAvatar: string;
  isAICreated?: boolean;
}

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState<PromptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPrompts = async () => {
      try {
        const res = await fetch("/api/prompts?featured=true&limit=6");
        const data = await res.json();
        if (data.success) {
          setPrompts(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured prompts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPrompts();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h2 className="section-title">精选提示词</h2>
              <p className="section-description">经过精心筛选的高质量 Prompt</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (prompts.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h2 className="section-title">精选提示词</h2>
            <p className="section-description">经过精心筛选的高质量 Prompt</p>
          </div>
          <Link
            href="/prompts?filter=featured"
            className="mt-4 sm:mt-0 inline-flex items-center text-primary-600 hover:text-primary-700 font-medium group"
          >
            查看更多
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="card-interactive p-6 group"
            >
              {/* Category Badge & AI Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="badge-primary text-xs">
                  {prompt.categoryName}
                </span>
                {prompt.isAICreated && (
                  <span className="flex items-center gap-1 text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    AI创作
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {prompt.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {truncateText(prompt.description, 80)}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(prompt.viewCount)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{formatNumber(prompt.favoriteCount)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Copy className="w-4 h-4" />
                    <span>{formatNumber(prompt.copyCount)}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <Image
                    src={prompt.authorAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
                    alt={prompt.authorName}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
