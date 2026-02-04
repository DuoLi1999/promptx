import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Shield, Wand2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              AI 驱动的提示词优化与分享平台
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 animate-slide-up">
            智能生成
            <span className="gradient-text">专业提示词</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in">
            描述您的需求，AI 自动生成优化后的提示词，一键发布到社区分享
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in">
            <a
              href="#optimizer"
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Wand2 className="w-5 h-5" />
              <span>开始创作</span>
            </a>
            <Link
              href="/prompts"
              className="btn-outline flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>浏览提示词</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <span>AI 智能优化</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Zap className="w-5 h-5 text-primary-500" />
              <span>一键发布分享</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>自动分类标签</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
