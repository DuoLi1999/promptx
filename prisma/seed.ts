import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 精简后的15个核心分类
const categoriesData = [
  {
    id: "research-academic",
    name: "科研学术",
    slug: "research-academic",
    description: "论文写作、文献综述、课题申请、学术展示等学术研究全流程",
    icon: "Microscope",
    color: "bg-blue-100 text-blue-600",
    subcategories: [
      { id: "topic-research", name: "选题与文献", slug: "topic-research" },
      { id: "research-design", name: "研究设计", slug: "research-design" },
      { id: "paper-writing", name: "论文写作", slug: "paper-writing" },
      { id: "submission-review", name: "投稿与审稿", slug: "submission-review" },
      { id: "grant-proposal", name: "基金申请", slug: "grant-proposal" },
      { id: "academic-english", name: "学术英语", slug: "academic-english" },
    ],
  },
  {
    id: "content-creation",
    name: "内容创作",
    slug: "content-creation",
    description: "视频脚本、文案写作、音乐创作、自媒体运营等内容生产",
    icon: "PenTool",
    color: "bg-purple-100 text-purple-600",
    subcategories: [
      { id: "video-script", name: "视频脚本", slug: "video-script" },
      { id: "copywriting", name: "文案撰写", slug: "copywriting" },
      { id: "social-media", name: "社媒推文", slug: "social-media" },
      { id: "ad-creative", name: "广告创意", slug: "ad-creative" },
      { id: "cover-title", name: "标题封面", slug: "cover-title" },
    ],
  },
  {
    id: "data-analysis",
    name: "数据分析",
    slug: "data-analysis",
    description: "数据清洗、可视化、指标体系、预测建模等数据工作",
    icon: "BarChart",
    color: "bg-green-100 text-green-600",
    subcategories: [
      { id: "data-cleaning", name: "数据清洗", slug: "data-cleaning" },
      { id: "metrics-system", name: "指标体系", slug: "metrics-system" },
      { id: "visualization", name: "可视化报表", slug: "visualization" },
      { id: "ab-testing", name: "AB实验", slug: "ab-testing" },
      { id: "analysis-report", name: "分析报告", slug: "analysis-report" },
    ],
  },
  {
    id: "software-dev",
    name: "程序开发",
    slug: "software-dev",
    description: "需求分析、代码生成、调试优化、架构设计等开发工作",
    icon: "Code",
    color: "bg-indigo-100 text-indigo-600",
    subcategories: [
      { id: "requirement-analysis", name: "需求分析", slug: "requirement-analysis" },
      { id: "code-generation", name: "代码生成", slug: "code-generation" },
      { id: "testing", name: "测试用例", slug: "testing" },
      { id: "debugging", name: "调试排错", slug: "debugging" },
      { id: "api-docs", name: "接口文档", slug: "api-docs" },
    ],
  },
  {
    id: "product-design",
    name: "产品设计",
    slug: "product-design",
    description: "用户研究、需求文档、原型设计、UI/UX设计等产品工作",
    icon: "Palette",
    color: "bg-pink-100 text-pink-600",
    subcategories: [
      { id: "user-research", name: "用户研究", slug: "user-research" },
      { id: "requirement-doc", name: "需求文档", slug: "requirement-doc" },
      { id: "ui-design", name: "界面设计", slug: "ui-design" },
      { id: "ux-design", name: "体验设计", slug: "ux-design" },
    ],
  },
  {
    id: "marketing-growth",
    name: "市场增长",
    slug: "marketing-growth",
    description: "市场调研、品牌策略、用户增长、投放优化等营销工作",
    icon: "Rocket",
    color: "bg-orange-100 text-orange-600",
    subcategories: [
      { id: "market-research", name: "市场调研", slug: "market-research" },
      { id: "brand-strategy", name: "品牌策略", slug: "brand-strategy" },
      { id: "user-acquisition", name: "用户获取", slug: "user-acquisition" },
      { id: "competitor-analysis", name: "竞品分析", slug: "competitor-analysis" },
    ],
  },
  {
    id: "ecommerce",
    name: "电商零售",
    slug: "ecommerce",
    description: "选品运营、商品文案、活动策划、直播带货等电商工作",
    icon: "ShoppingBag",
    color: "bg-cyan-100 text-cyan-600",
    subcategories: [
      { id: "product-selection", name: "选品策略", slug: "product-selection" },
      { id: "product-copy", name: "商品文案", slug: "product-copy" },
      { id: "event-planning", name: "活动策划", slug: "event-planning" },
      { id: "live-commerce", name: "直播带货", slug: "live-commerce" },
    ],
  },
  {
    id: "sales-business",
    name: "商务销售",
    slug: "sales-business",
    description: "线索开发、方案报价、商务谈判、客户管理等销售工作",
    icon: "TrendingUp",
    color: "bg-amber-100 text-amber-600",
    subcategories: [
      { id: "lead-generation", name: "线索开发", slug: "lead-generation" },
      { id: "sales-pitch", name: "销售话术", slug: "sales-pitch" },
      { id: "proposal", name: "方案报价", slug: "proposal" },
      { id: "negotiation", name: "商务谈判", slug: "negotiation" },
    ],
  },
  {
    id: "customer-support",
    name: "客户服务",
    slug: "customer-support",
    description: "工单处理、知识库、投诉应对、满意度提升等客服工作",
    icon: "Headphones",
    color: "bg-emerald-100 text-emerald-600",
    subcategories: [
      { id: "ticket-reply", name: "工单回复", slug: "ticket-reply" },
      { id: "faq-knowledge", name: "知识库", slug: "faq-knowledge" },
      { id: "complaint-handling", name: "投诉处理", slug: "complaint-handling" },
    ],
  },
  {
    id: "enterprise-management",
    name: "企业管理",
    slug: "enterprise-management",
    description: "招聘面试、绩效考核、项目管理、流程规范等管理工作",
    icon: "Users",
    color: "bg-sky-100 text-sky-600",
    subcategories: [
      { id: "recruitment", name: "招聘面试", slug: "recruitment" },
      { id: "performance", name: "绩效考核", slug: "performance" },
      { id: "project-plan", name: "项目计划", slug: "project-plan" },
      { id: "process-sop", name: "流程规范", slug: "process-sop" },
    ],
  },
  {
    id: "finance-legal",
    name: "财务法务",
    slug: "finance-legal",
    description: "预算分析、财务报表、合同审核、合规风控等财法工作",
    icon: "Calculator",
    color: "bg-lime-100 text-lime-600",
    subcategories: [
      { id: "budget-forecast", name: "预算编制", slug: "budget-forecast" },
      { id: "financial-report", name: "财务报表", slug: "financial-report" },
      { id: "contract-review", name: "合同审核", slug: "contract-review" },
      { id: "compliance", name: "合规审查", slug: "compliance" },
    ],
  },
  {
    id: "education-training",
    name: "教育培训",
    slug: "education-training",
    description: "课程设计、教案编写、题库出卷、学习辅导等教育工作",
    icon: "BookOpen",
    color: "bg-yellow-100 text-yellow-600",
    subcategories: [
      { id: "course-design", name: "课程设计", slug: "course-design" },
      { id: "lesson-plan", name: "教案编写", slug: "lesson-plan" },
      { id: "quiz-exam", name: "题库出卷", slug: "quiz-exam" },
      { id: "learning-plan", name: "学习计划", slug: "learning-plan" },
    ],
  },
  {
    id: "health-medical",
    name: "医疗健康",
    slug: "health-medical",
    description: "健康科普、医学文献、临床文书、患者沟通等医疗工作",
    icon: "Heart",
    color: "bg-rose-100 text-rose-600",
    subcategories: [
      { id: "health-education", name: "健康科普", slug: "health-education" },
      { id: "medical-literature", name: "医学文献", slug: "medical-literature" },
      { id: "patient-education", name: "患者教育", slug: "patient-education" },
    ],
  },
  {
    id: "strategy-consulting",
    name: "战略咨询",
    slug: "strategy-consulting",
    description: "行业研究、商业分析、战略规划、咨询报告等咨询工作",
    icon: "Lightbulb",
    color: "bg-fuchsia-100 text-fuchsia-600",
    subcategories: [
      { id: "industry-research", name: "行业研究", slug: "industry-research" },
      { id: "business-model", name: "商业模式", slug: "business-model" },
      { id: "pricing-strategy", name: "定价策略", slug: "pricing-strategy" },
      { id: "strategy-report", name: "战略报告", slug: "strategy-report" },
    ],
  },
  {
    id: "translation-localization",
    name: "翻译写作",
    slug: "translation-localization",
    description: "中英互译、本地化、字幕翻译、多语言文案等翻译工作",
    icon: "Globe",
    color: "bg-teal-100 text-teal-600",
    subcategories: [
      { id: "translation", name: "中英互译", slug: "translation" },
      { id: "localization", name: "本地化改写", slug: "localization" },
      { id: "proofreading", name: "润色校对", slug: "proofreading" },
    ],
  },
];

const usersData = [
  {
    email: "demo@promptx.com",
    password: "password123",
    name: "PromptX官方",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=promptx",
    bio: "PromptX官方账号",
  },
];

async function main() {
  console.log("开始填充数据库...");

  // 清理
  await prisma.favorite.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log("已清理现有数据");

  // 创建分类
  for (const cat of categoriesData) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        subcategories: {
          create: cat.subcategories.map((sub) => ({
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
          })),
        },
      },
    });
  }
  console.log("已创建 " + categoriesData.length + " 个分类");

  // 创建用户
  const hashedPassword = await bcrypt.hash(usersData[0].password, 12);
  const user = await prisma.user.create({
    data: {
      email: usersData[0].email,
      password: hashedPassword,
      name: usersData[0].name,
      avatar: usersData[0].avatar,
      bio: usersData[0].bio,
    },
  });
  console.log("已创建用户");

  // 创建示例提示词
  await prisma.prompt.create({
    data: {
      title: "学术论文润色专家",
      description: "帮助研究者润色学术论文，提升语言表达的准确性",
      content: "你是一位资深的学术论文润色专家...",
      categoryId: "research-academic",
      categoryName: "科研学术",
      subcategoryId: "paper-writing",
      subcategoryName: "论文写作",
      taskType: "text",
      targetTool: "Claude",
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || "",
      tags: "学术,论文,润色",
      viewCount: 1000,
      favoriteCount: 100,
      copyCount: 500,
      isFeatured: true,
    },
  });

  await prisma.prompt.create({
    data: {
      title: "短视频脚本生成器",
      description: "根据主题快速生成吸引人的短视频脚本",
      content: "你是一位专业的短视频内容创作者...",
      categoryId: "content-creation",
      categoryName: "内容创作",
      subcategoryId: "video-script",
      subcategoryName: "视频脚本",
      taskType: "text",
      targetTool: "ChatGPT",
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || "",
      tags: "短视频,脚本,创作",
      viewCount: 2000,
      favoriteCount: 200,
      copyCount: 800,
      isFeatured: true,
    },
  });

  await prisma.prompt.create({
    data: {
      title: "数据分析报告生成器",
      description: "根据数据自动生成专业的分析报告",
      content: "你是一位数据分析专家，擅长从数据中提取洞察...",
      categoryId: "data-analysis",
      categoryName: "数据分析",
      subcategoryId: "analysis-report",
      subcategoryName: "分析报告",
      taskType: "text",
      targetTool: "DeepSeek",
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar || "",
      tags: "数据分析,报告,洞察",
      viewCount: 1500,
      favoriteCount: 150,
      copyCount: 600,
      isFeatured: true,
    },
  });

  console.log("已创建示例提示词");
  console.log("数据库填充完成！");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
