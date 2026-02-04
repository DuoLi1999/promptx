import type { Category, Prompt } from "@/types";

// 精简后的15个核心分类
export const categories: Category[] = [
  {
    id: "research-academic",
    name: "科研学术",
    slug: "research-academic",
    description: "论文写作、文献综述、课题申请、学术展示等学术研究全流程",
    icon: "Microscope",
    color: "bg-blue-100 text-blue-600",
    promptCount: 0,
    subcategories: [
      { id: "topic-research", name: "选题与文献", slug: "topic-research", categoryId: "research-academic" },
      { id: "research-design", name: "研究设计", slug: "research-design", categoryId: "research-academic" },
      { id: "paper-writing", name: "论文写作", slug: "paper-writing", categoryId: "research-academic" },
      { id: "submission-review", name: "投稿与审稿", slug: "submission-review", categoryId: "research-academic" },
      { id: "grant-proposal", name: "基金申请", slug: "grant-proposal", categoryId: "research-academic" },
      { id: "academic-english", name: "学术英语", slug: "academic-english", categoryId: "research-academic" },
    ],
  },
  {
    id: "content-creation",
    name: "内容创作",
    slug: "content-creation",
    description: "视频脚本、文案写作、音乐创作、自媒体运营等内容生产",
    icon: "PenTool",
    color: "bg-purple-100 text-purple-600",
    promptCount: 0,
    subcategories: [
      { id: "video-script", name: "视频脚本", slug: "video-script", categoryId: "content-creation" },
      { id: "copywriting", name: "文案撰写", slug: "copywriting", categoryId: "content-creation" },
      { id: "social-media", name: "社媒推文", slug: "social-media", categoryId: "content-creation" },
      { id: "ad-creative", name: "广告创意", slug: "ad-creative", categoryId: "content-creation" },
      { id: "cover-title", name: "标题封面", slug: "cover-title", categoryId: "content-creation" },
    ],
  },
  {
    id: "data-analysis",
    name: "数据分析",
    slug: "data-analysis",
    description: "数据清洗、可视化、指标体系、预测建模等数据工作",
    icon: "BarChart",
    color: "bg-green-100 text-green-600",
    promptCount: 0,
    subcategories: [
      { id: "data-cleaning", name: "数据清洗", slug: "data-cleaning", categoryId: "data-analysis" },
      { id: "metrics-system", name: "指标体系", slug: "metrics-system", categoryId: "data-analysis" },
      { id: "visualization", name: "可视化报表", slug: "visualization", categoryId: "data-analysis" },
      { id: "ab-testing", name: "AB实验", slug: "ab-testing", categoryId: "data-analysis" },
      { id: "analysis-report", name: "分析报告", slug: "analysis-report", categoryId: "data-analysis" },
    ],
  },
  {
    id: "software-dev",
    name: "程序开发",
    slug: "software-dev",
    description: "需求分析、代码生成、调试优化、架构设计等开发工作",
    icon: "Code",
    color: "bg-indigo-100 text-indigo-600",
    promptCount: 0,
    subcategories: [
      { id: "requirement-analysis", name: "需求分析", slug: "requirement-analysis", categoryId: "software-dev" },
      { id: "code-generation", name: "代码生成", slug: "code-generation", categoryId: "software-dev" },
      { id: "testing", name: "测试用例", slug: "testing", categoryId: "software-dev" },
      { id: "debugging", name: "调试排错", slug: "debugging", categoryId: "software-dev" },
      { id: "api-docs", name: "接口文档", slug: "api-docs", categoryId: "software-dev" },
    ],
  },
  {
    id: "product-design",
    name: "产品设计",
    slug: "product-design",
    description: "用户研究、需求文档、原型设计、UI/UX设计等产品工作",
    icon: "Palette",
    color: "bg-pink-100 text-pink-600",
    promptCount: 0,
    subcategories: [
      { id: "user-research", name: "用户研究", slug: "user-research", categoryId: "product-design" },
      { id: "requirement-doc", name: "需求文档", slug: "requirement-doc", categoryId: "product-design" },
      { id: "ui-design", name: "界面设计", slug: "ui-design", categoryId: "product-design" },
      { id: "ux-design", name: "体验设计", slug: "ux-design", categoryId: "product-design" },
    ],
  },
  {
    id: "marketing-growth",
    name: "市场增长",
    slug: "marketing-growth",
    description: "市场调研、品牌策略、用户增长、投放优化等营销工作",
    icon: "Rocket",
    color: "bg-orange-100 text-orange-600",
    promptCount: 0,
    subcategories: [
      { id: "market-research", name: "市场调研", slug: "market-research", categoryId: "marketing-growth" },
      { id: "brand-strategy", name: "品牌策略", slug: "brand-strategy", categoryId: "marketing-growth" },
      { id: "user-acquisition", name: "用户获取", slug: "user-acquisition", categoryId: "marketing-growth" },
      { id: "competitor-analysis", name: "竞品分析", slug: "competitor-analysis", categoryId: "marketing-growth" },
    ],
  },
  {
    id: "ecommerce",
    name: "电商零售",
    slug: "ecommerce",
    description: "选品运营、商品文案、活动策划、直播带货等电商工作",
    icon: "ShoppingBag",
    color: "bg-cyan-100 text-cyan-600",
    promptCount: 0,
    subcategories: [
      { id: "product-selection", name: "选品策略", slug: "product-selection", categoryId: "ecommerce" },
      { id: "product-copy", name: "商品文案", slug: "product-copy", categoryId: "ecommerce" },
      { id: "event-planning", name: "活动策划", slug: "event-planning", categoryId: "ecommerce" },
      { id: "live-commerce", name: "直播带货", slug: "live-commerce", categoryId: "ecommerce" },
    ],
  },
  {
    id: "sales-business",
    name: "商务销售",
    slug: "sales-business",
    description: "线索开发、方案报价、商务谈判、客户管理等销售工作",
    icon: "TrendingUp",
    color: "bg-amber-100 text-amber-600",
    promptCount: 0,
    subcategories: [
      { id: "lead-generation", name: "线索开发", slug: "lead-generation", categoryId: "sales-business" },
      { id: "sales-pitch", name: "销售话术", slug: "sales-pitch", categoryId: "sales-business" },
      { id: "proposal", name: "方案报价", slug: "proposal", categoryId: "sales-business" },
      { id: "negotiation", name: "商务谈判", slug: "negotiation", categoryId: "sales-business" },
    ],
  },
  {
    id: "customer-support",
    name: "客户服务",
    slug: "customer-support",
    description: "工单处理、知识库、投诉应对、满意度提升等客服工作",
    icon: "Headphones",
    color: "bg-emerald-100 text-emerald-600",
    promptCount: 0,
    subcategories: [
      { id: "ticket-reply", name: "工单回复", slug: "ticket-reply", categoryId: "customer-support" },
      { id: "faq-knowledge", name: "知识库", slug: "faq-knowledge", categoryId: "customer-support" },
      { id: "complaint-handling", name: "投诉处理", slug: "complaint-handling", categoryId: "customer-support" },
    ],
  },
  {
    id: "enterprise-management",
    name: "企业管理",
    slug: "enterprise-management",
    description: "招聘面试、绩效考核、项目管理、流程规范等管理工作",
    icon: "Users",
    color: "bg-sky-100 text-sky-600",
    promptCount: 0,
    subcategories: [
      { id: "recruitment", name: "招聘面试", slug: "recruitment", categoryId: "enterprise-management" },
      { id: "performance", name: "绩效考核", slug: "performance", categoryId: "enterprise-management" },
      { id: "project-plan", name: "项目计划", slug: "project-plan", categoryId: "enterprise-management" },
      { id: "process-sop", name: "流程规范", slug: "process-sop", categoryId: "enterprise-management" },
    ],
  },
  {
    id: "finance-legal",
    name: "财务法务",
    slug: "finance-legal",
    description: "预算分析、财务报表、合同审核、合规风控等财法工作",
    icon: "Calculator",
    color: "bg-lime-100 text-lime-600",
    promptCount: 0,
    subcategories: [
      { id: "budget-forecast", name: "预算编制", slug: "budget-forecast", categoryId: "finance-legal" },
      { id: "financial-report", name: "财务报表", slug: "financial-report", categoryId: "finance-legal" },
      { id: "contract-review", name: "合同审核", slug: "contract-review", categoryId: "finance-legal" },
      { id: "compliance", name: "合规审查", slug: "compliance", categoryId: "finance-legal" },
    ],
  },
  {
    id: "education-training",
    name: "教育培训",
    slug: "education-training",
    description: "课程设计、教案编写、题库出卷、学习辅导等教育工作",
    icon: "BookOpen",
    color: "bg-yellow-100 text-yellow-600",
    promptCount: 0,
    subcategories: [
      { id: "course-design", name: "课程设计", slug: "course-design", categoryId: "education-training" },
      { id: "lesson-plan", name: "教案编写", slug: "lesson-plan", categoryId: "education-training" },
      { id: "quiz-exam", name: "题库出卷", slug: "quiz-exam", categoryId: "education-training" },
      { id: "learning-plan", name: "学习计划", slug: "learning-plan", categoryId: "education-training" },
    ],
  },
  {
    id: "health-medical",
    name: "医疗健康",
    slug: "health-medical",
    description: "健康科普、医学文献、临床文书、患者沟通等医疗工作",
    icon: "Heart",
    color: "bg-rose-100 text-rose-600",
    promptCount: 0,
    subcategories: [
      { id: "health-education", name: "健康科普", slug: "health-education", categoryId: "health-medical" },
      { id: "medical-literature", name: "医学文献", slug: "medical-literature", categoryId: "health-medical" },
      { id: "patient-education", name: "患者教育", slug: "patient-education", categoryId: "health-medical" },
    ],
  },
  {
    id: "strategy-consulting",
    name: "战略咨询",
    slug: "strategy-consulting",
    description: "行业研究、商业分析、战略规划、咨询报告等咨询工作",
    icon: "Lightbulb",
    color: "bg-fuchsia-100 text-fuchsia-600",
    promptCount: 0,
    subcategories: [
      { id: "industry-research", name: "行业研究", slug: "industry-research", categoryId: "strategy-consulting" },
      { id: "business-model", name: "商业模式", slug: "business-model", categoryId: "strategy-consulting" },
      { id: "pricing-strategy", name: "定价策略", slug: "pricing-strategy", categoryId: "strategy-consulting" },
      { id: "strategy-report", name: "战略报告", slug: "strategy-report", categoryId: "strategy-consulting" },
    ],
  },
  {
    id: "translation-localization",
    name: "翻译写作",
    slug: "translation-localization",
    description: "中英互译、本地化、字幕翻译、多语言文案等翻译工作",
    icon: "Globe",
    color: "bg-teal-100 text-teal-600",
    promptCount: 0,
    subcategories: [
      { id: "translation", name: "中英互译", slug: "translation", categoryId: "translation-localization" },
      { id: "localization", name: "本地化改写", slug: "localization", categoryId: "translation-localization" },
      { id: "proofreading", name: "润色校对", slug: "proofreading", categoryId: "translation-localization" },
    ],
  },
];

// 获取分类图标映射
export const getCategoryIcon = (iconName: string) => iconName;

// 根据ID获取分类
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

// 根据slug获取分类
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// 获取所有子分类
export function getAllSubcategories() {
  return categories.flatMap((c) => c.subcategories);
}

// 更新分类的提示词数量（基于实际数据）
export function updateCategoryPromptCounts(prompts: Prompt[]) {
  const countMap = new Map<string, number>();

  prompts.forEach((prompt) => {
    const categoryId = prompt.categoryId;
    countMap.set(categoryId, (countMap.get(categoryId) || 0) + 1);
  });

  categories.forEach((category) => {
    const count = countMap.get(category.id) || 0;
    category.promptCount = count;
  });

  return categories;
}
