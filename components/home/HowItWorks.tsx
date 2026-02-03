import { Search, Copy, Sparkles, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "搜索或浏览",
    description: "通过分类、关键词或标签，快速找到您需要的 Prompt",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Copy,
    title: "一键复制",
    description: "选中心仪的 Prompt，点击即可复制到剪贴板",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Sparkles,
    title: "粘贴使用",
    description: "将 Prompt 粘贴到 ChatGPT、Claude 等 AI 工具中",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: CheckCircle,
    title: "获得结果",
    description: "享受专业 Prompt 带来的高质量 AI 输出",
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
            只需简单四步，即可获得专业级的 AI 输出结果
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
