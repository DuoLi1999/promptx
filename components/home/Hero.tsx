import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              覆盖 20+ 职业领域，10,000+ 专业提示词
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
            发现最适合您的
            <br />
            <span className="gradient-text">AI 提示词</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in">
            按职业分类的高质量 Prompt
            库，覆盖科研、自媒体、数据分析、程序开发等多个领域，
            帮助您更高效地使用 AI 工具
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
            <Link
              href="/prompts"
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>开始探索</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Zap className="w-5 h-5 text-primary-500" />
              <span>即用即走，提升效率</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5 text-purple-500" />
              <span>专业审核，质量保证</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Globe className="w-5 h-5 text-primary-500" />
              <span>持续更新，紧跟前沿</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
