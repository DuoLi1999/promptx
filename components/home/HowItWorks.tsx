import { Search, Wand2, Copy, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "发现提示词",
    description: "按职业分类浏览，或搜索关键词，快速找到您需要的 Prompt",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Wand2,
    title: "AI智能创作",
    description: "输入您的需求，AI 帮您生成专业的提示词，省时省力",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Copy,
    title: "一键复制使用",
    description: "选中心仪的 Prompt，点击即可复制到 ChatGPT、Claude 等工具",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Sparkles,
    title: "分享您的作品",
    description: "创作或优化好的提示词，发布到平台与他人分享",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">如何使用</h2>
          <p className="section-description max-w-2xl mx-auto">
            简单四步，开启您的 AI 提示词之旅
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200" />
              )}

              <div className="text-center relative z-10">
                {/* Step number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={`w-24 h-24 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <step.icon className="w-10 h-10" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
