import { Sparkles, Users, Target, Heart, Zap, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">关于 PromptX</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              让每个人都能高效使用 AI
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              PromptX 是一个专业的 AI 提示词资源库，致力于帮助各行各业的用户
              更好地利用 AI 工具提升工作效率
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              我们的使命
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              在 AI 时代，Prompt（提示词）已经成为人与 AI 沟通的桥梁。 一个好的
              Prompt 可以让 AI 输出更准确、更专业的内容。
            </p>
            <p className="text-lg text-gray-600 mb-6">
              然而，编写高质量的 Prompt 需要技巧和经验。这就是 PromptX
              存在的意义—— 我们汇集了各行业专家的智慧，将他们的 Prompt
              实践总结成模板， 让每个人都能轻松获得专业级的 AI 输出。
            </p>
            <p className="text-lg text-gray-600">
              无论您是科研工作者、内容创作者、数据分析师还是产品经理， 都能在
              PromptX 找到适合您的专业提示词。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                20+
              </div>
              <div className="text-gray-600">职业分类</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                10K+
              </div>
              <div className="text-gray-600">提示词模板</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                50K+
              </div>
              <div className="text-gray-600">活跃用户</div>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">细分场景</div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              我们的价值观
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              这些核心价值观指导着我们的产品开发和用户服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">专业精准</h3>
              <p className="text-gray-600">
                每个提示词都经过专业审核，确保输出质量。我们追求精准，拒绝泛泛而谈。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">用户至上</h3>
              <p className="text-gray-600">
                用户的需求是我们前进的动力。我们持续倾听反馈，不断优化产品体验。
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">高效创新</h3>
              <p className="text-gray-600">
                AI
                技术日新月异，我们紧跟前沿，持续更新内容，确保提示词的时效性。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            为什么选择 PromptX
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们提供全面、专业、易用的提示词服务
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">覆盖全面</h3>
            <p className="text-gray-600">
              20+ 职业分类，100+ 细分场景，从科研学术到电商运营，
              覆盖您能想到的各种工作场景。
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">专业审核</h3>
            <p className="text-gray-600">
              每个提示词都经过专业人士审核，确保内容准确、表述清晰、
              输出可控，避免模糊或无效的结果。
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">即用即走</h3>
            <p className="text-gray-600">
              一键复制，直接粘贴到 ChatGPT、Claude 等 AI 工具中使用，
              无需学习复杂的 Prompt 技巧。
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">持续更新</h3>
            <p className="text-gray-600">
              AI 技术快速发展，我们的内容也在持续更新迭代，
              确保提示词始终保持最佳效果。
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              开始您的 AI 效率提升之旅
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              立即探索 PromptX，找到适合您的专业提示词
            </p>
            <a
              href="/prompts"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              开始探索
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
