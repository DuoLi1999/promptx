import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// 分类数据
const categoriesData = [
  {
    id: "research-academic",
    name: "科研学术",
    slug: "research-academic",
    description:
      "选题与研究问题、文献综述、论文写作、投稿回复、基金申请等学术场景",
    icon: "Microscope",
    color: "bg-blue-100 text-blue-600",
    subcategories: [
      { id: "topic-gap", name: "选题与研究问题（gap挖掘）", slug: "topic-gap" },
      {
        id: "literature-review",
        name: "文献检索与综述",
        slug: "literature-review",
      },
      {
        id: "research-design",
        name: "研究设计（变量、假设、方法）",
        slug: "research-design",
      },
      { id: "paper-writing", name: "论文写作", slug: "paper-writing" },
      {
        id: "submission-rebuttal",
        name: "投稿与审稿回复",
        slug: "submission-rebuttal",
      },
    ],
  },
  {
    id: "video-creation",
    name: "视频创作",
    slug: "video-creation",
    description: "选题、口播脚本、分镜、剪辑节奏、标题封面、直播带货、运营复盘",
    icon: "Video",
    color: "bg-red-100 text-red-600",
    subcategories: [
      {
        id: "topic-library",
        name: "选题库（热点/常青内容）",
        slug: "topic-library",
      },
      {
        id: "script-structure",
        name: "脚本结构（起承转合）",
        slug: "script-structure",
      },
      { id: "voiceover-script", name: "口播逐字稿", slug: "voiceover-script" },
      { id: "storyboard", name: "分镜与镜头清单", slug: "storyboard" },
      { id: "cover-title", name: "封面与标题", slug: "cover-title" },
    ],
  },
  {
    id: "data-analysis",
    name: "数据分析",
    slug: "data-analysis",
    description:
      "埋点口径、数据清洗、EDA探索、指标体系、A/B实验、预测建模、分析写作",
    icon: "BarChart",
    color: "bg-green-100 text-green-600",
    subcategories: [
      {
        id: "data-acquisition",
        name: "数据获取（埋点、口径）",
        slug: "data-acquisition",
      },
      { id: "data-cleaning", name: "数据清洗", slug: "data-cleaning" },
      { id: "eda-exploration", name: "EDA探索", slug: "eda-exploration" },
      { id: "metrics-system", name: "指标体系", slug: "metrics-system" },
      { id: "ab-experiment", name: "A/B实验分析", slug: "ab-experiment" },
    ],
  },
  {
    id: "copywriting",
    name: "文案写作",
    slug: "copywriting",
    description:
      "品牌Slogan、新媒体推文、广告创意、SEO文章、产品文案、PR稿、演讲稿",
    icon: "PenTool",
    color: "bg-purple-100 text-purple-600",
    subcategories: [
      { id: "brand-slogan", name: "品牌Slogan/定位语", slug: "brand-slogan" },
      { id: "social-media", name: "新媒体推文", slug: "social-media" },
      { id: "ad-creative", name: "广告创意", slug: "ad-creative" },
      { id: "product-copy", name: "产品文案", slug: "product-copy" },
      {
        id: "business-email",
        name: "商务邮件/私信话术",
        slug: "business-email",
      },
    ],
  },
  {
    id: "software-development",
    name: "程序开发",
    slug: "software-development",
    description:
      "需求澄清、架构设计、代码生成、测试、Debug、性能优化、API文档、DevOps",
    icon: "Code",
    color: "bg-indigo-100 text-indigo-600",
    subcategories: [
      {
        id: "requirement-clarify",
        name: "需求澄清（用户故事）",
        slug: "requirement-clarify",
      },
      {
        id: "architecture-design",
        name: "架构设计",
        slug: "architecture-design",
      },
      {
        id: "code-generation",
        name: "代码生成（脚手架、模板）",
        slug: "code-generation",
      },
      { id: "unit-testing", name: "单元测试/测试用例", slug: "unit-testing" },
      {
        id: "debug-troubleshoot",
        name: "Debug与报错定位",
        slug: "debug-troubleshoot",
      },
    ],
  },
  {
    id: "marketing",
    name: "市场营销",
    slug: "marketing",
    description:
      "市场调研、用户画像、品牌策略、内容营销、投放、SEO/SEM、公关传播",
    icon: "Megaphone",
    color: "bg-orange-100 text-orange-600",
    subcategories: [
      { id: "market-research", name: "市场调研", slug: "market-research" },
      { id: "user-persona", name: "用户画像/细分", slug: "user-persona" },
      { id: "brand-strategy", name: "品牌策略", slug: "brand-strategy" },
      { id: "content-marketing", name: "内容营销", slug: "content-marketing" },
      { id: "seo-sem", name: "SEO/SEM", slug: "seo-sem" },
    ],
  },
  {
    id: "product-management",
    name: "产品管理",
    slug: "product-management",
    description:
      "用户研究、需求管理、PRD与原型、版本规划、指标设计、增长策略、复盘机制",
    icon: "Briefcase",
    color: "bg-teal-100 text-teal-600",
    subcategories: [
      { id: "user-research", name: "用户研究", slug: "user-research" },
      {
        id: "requirement-management",
        name: "需求管理",
        slug: "requirement-management",
      },
      { id: "prd-prototype", name: "PRD与原型", slug: "prd-prototype" },
      { id: "growth-strategy", name: "增长策略", slug: "growth-strategy" },
    ],
  },
  {
    id: "design-creative",
    name: "设计创意",
    slug: "design-creative",
    description:
      "品牌视觉、UI/UX、设计系统、海报物料、插画IP、动效包装、数据可视化设计",
    icon: "Palette",
    color: "bg-pink-100 text-pink-600",
    subcategories: [
      { id: "brand-visual", name: "品牌视觉（VI规范）", slug: "brand-visual" },
      { id: "ui-design", name: "UI界面", slug: "ui-design" },
      { id: "ux-experience", name: "UX体验", slug: "ux-experience" },
      { id: "poster-kv", name: "海报/平面KV", slug: "poster-kv" },
    ],
  },
  {
    id: "education-training",
    name: "教育培训",
    slug: "education-training",
    description:
      "课程大纲、教案讲义、PPT脚本、题库测验、学习计划、批改反馈、教研迭代",
    icon: "BookOpen",
    color: "bg-yellow-100 text-yellow-600",
    subcategories: [
      { id: "course-outline", name: "课程大纲", slug: "course-outline" },
      { id: "lesson-plan", name: "教案/讲义", slug: "lesson-plan" },
      { id: "quiz-bank", name: "题库与测验", slug: "quiz-bank" },
      { id: "learning-plan", name: "学习计划", slug: "learning-plan" },
    ],
  },
  {
    id: "ecommerce",
    name: "电商运营",
    slug: "ecommerce",
    description:
      "选品人群、商品标题、详情页、活动策划、广告投放、直播运营、数据分析",
    icon: "ShoppingBag",
    color: "bg-cyan-100 text-cyan-600",
    subcategories: [
      {
        id: "product-selection",
        name: "选品与人群",
        slug: "product-selection",
      },
      { id: "product-title", name: "商品标题/卖点", slug: "product-title" },
      { id: "detail-page", name: "详情页结构", slug: "detail-page" },
      { id: "event-planning", name: "活动策划", slug: "event-planning" },
    ],
  },
  {
    id: "health-medical",
    name: "健康医疗",
    slug: "health-medical",
    description:
      "健康科普、医学文献速读、临床文书、患教材料、医院运营、医疗数据分析",
    icon: "Heart",
    color: "bg-rose-100 text-rose-600",
    subcategories: [
      { id: "health-science", name: "健康科普内容", slug: "health-science" },
      {
        id: "medical-literature",
        name: "医学文献速读",
        slug: "medical-literature",
      },
      { id: "patient-education", name: "患教材料", slug: "patient-education" },
    ],
  },
  {
    id: "music-art",
    name: "音乐艺术",
    slug: "music-art",
    description:
      "作曲灵感、和声编配、歌词创作、练习计划、乐理学习、录音混音、演出策划",
    icon: "Music",
    color: "bg-violet-100 text-violet-600",
    subcategories: [
      {
        id: "composition-theme",
        name: "作曲灵感与主题",
        slug: "composition-theme",
      },
      { id: "lyrics-writing", name: "歌词创作", slug: "lyrics-writing" },
      { id: "music-theory", name: "乐理学习", slug: "music-theory" },
    ],
  },
];

// 示例用户数据
const usersData = [
  {
    email: "zhang@example.com",
    password: "password123",
    name: "张教授",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhang",
    bio: "资深科研工作者，专注学术写作领域",
  },
  {
    email: "li@example.com",
    password: "password123",
    name: "李创作",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=li",
    bio: "短视频创作达人，全网粉丝100万+",
  },
  {
    email: "wang@example.com",
    password: "password123",
    name: "王分析师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wang",
    bio: "数据分析师，擅长SQL和Python",
  },
];

async function main() {
  console.log("开始填充数据库...");

  // 清理现有数据
  await prisma.favorite.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("已清理现有数据");

  // 创建分类和子分类
  for (const cat of categoriesData) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        promptCount: 0,
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
  console.log("已创建分类数据");

  // 创建用户
  const createdUsers = [];
  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        avatar: userData.avatar,
        bio: userData.bio,
      },
    });
    createdUsers.push(user);
  }
  console.log("已创建用户数据");

  // 创建示例提示词
  const promptsData = [
    {
      title: "文献综述提纲生成器（含对比表）",
      description:
        "把你的研究主题与关键词输入，输出综述提纲、关键分歧点、代表论文对比表。",
      content: `# 文献综述提纲生成器

你是一位经验丰富的学术研究助手，专注于帮助研究者撰写高质量的文献综述。

## 任务
根据用户提供的研究主题和关键词，生成一份完整的文献综述提纲。

## 输入信息
- 研究主题：[用户填写]
- 关键词：[用户填写]
- 研究领域：[用户填写]

## 输出格式

### 一、综述提纲
1. 引言
   - 研究背景
   - 研究意义
   - 综述目的和范围

2. 主题一：[核心概念]
   - 定义与演变
   - 主要理论框架
   - 研究现状

3. 研究分歧与争议
4. 研究趋势与展望
5. 结论

### 二、代表论文对比表
| 作者(年份) | 研究问题 | 方法 | 主要发现 | 局限性 |

请开始分析。`,
      categoryId: "research-academic",
      categoryName: "科研学术",
      subcategoryId: "literature-review",
      subcategoryName: "文献检索与综述",
      taskType: "text",
      targetTool: "ChatGPT",
      difficulty: "beginner",
      authorIndex: 0,
      tags: "文献综述,学术,论文,研究",
      viewCount: 15230,
      favoriteCount: 892,
      copyCount: 3420,
      rating: 4.9,
      reviewCount: 234,
      isFeatured: true,
      isTrending: true,
    },
    {
      title: "短视频口播脚本生成器",
      description:
        "输入主题和时长，生成带有开场钩子、内容节奏和结尾引导的完整口播稿。",
      content: `# 短视频口播脚本生成器

你是一位专业的短视频内容策划师，擅长创作吸引人的口播脚本。

## 输入信息
- 视频主题：[用户填写]
- 目标时长：[30秒/60秒/3分钟]
- 账号定位：[知识分享/娱乐搞笑/情感励志]
- 目标平台：[抖音/快手/小红书/B站]

## 脚本结构

### 开场钩子（前3秒）
- 直击痛点的问题
- 反常识的观点
- 悬念式开头

### 内容主体
- 第一点：[核心论点]
- 第二点：[补充说明]
- 第三点：[案例佐证]

### 结尾引导
- 金句总结
- 行动号召
- 互动引导

请生成完整脚本。`,
      categoryId: "video-creation",
      categoryName: "视频创作",
      subcategoryId: "voiceover-script",
      subcategoryName: "口播逐字稿",
      taskType: "text",
      targetTool: "ChatGPT",
      difficulty: "beginner",
      authorIndex: 1,
      tags: "短视频,口播,脚本,抖音",
      viewCount: 12580,
      favoriteCount: 756,
      copyCount: 2890,
      rating: 4.8,
      reviewCount: 189,
      isFeatured: true,
      isTrending: true,
    },
    {
      title: "数据分析报告框架生成器",
      description:
        "根据业务场景和数据类型，生成专业的数据分析报告框架和洞察模板。",
      content: `# 数据分析报告框架生成器

你是一位资深的数据分析师，帮助用户构建专业的分析报告框架。

## 输入信息
- 分析目的：[用户填写]
- 业务场景：[电商/金融/游戏/SaaS]
- 数据范围：[用户填写]
- 汇报对象：[老板/产品/运营]

## 报告框架

### 1. 执行摘要
- 核心结论（1-3点）
- 关键指标变化
- 建议行动

### 2. 分析背景
- 业务背景
- 分析目的
- 数据范围

### 3. 核心发现
- 发现一：[数据 + 结论]
- 发现二：[数据 + 结论]
- 发现三：[数据 + 结论]

### 4. 深度分析
- 原因分析
- 对比分析
- 趋势分析

### 5. 建议与行动
- 短期行动
- 长期策略

请生成完整框架。`,
      categoryId: "data-analysis",
      categoryName: "数据分析",
      subcategoryId: "metrics-system",
      subcategoryName: "指标体系",
      taskType: "text",
      targetTool: "Claude",
      difficulty: "intermediate",
      authorIndex: 2,
      tags: "数据分析,报告,指标,洞察",
      viewCount: 9870,
      favoriteCount: 534,
      copyCount: 1890,
      rating: 4.7,
      reviewCount: 156,
      isFeatured: true,
      isTrending: false,
    },
    {
      title: "代码Review助手",
      description:
        "提交代码片段，获得专业的代码审查意见，包括性能、安全和最佳实践建议。",
      content: `# 代码Review助手

你是一位经验丰富的高级软件工程师，擅长代码审查和最佳实践指导。

## 审查维度

### 1. 代码质量
- 命名规范
- 代码结构
- 复杂度分析

### 2. 性能优化
- 算法效率
- 内存使用
- 并发安全

### 3. 安全检查
- 输入验证
- SQL注入风险
- XSS风险

### 4. 最佳实践
- 设计模式应用
- SOLID原则
- 可测试性

## 输入代码
\`\`\`
[用户粘贴代码]
\`\`\`

## 输出格式
1. 问题列表（按严重程度排序）
2. 改进建议
3. 优化后的代码示例`,
      categoryId: "software-development",
      categoryName: "程序开发",
      subcategoryId: "code-generation",
      subcategoryName: "代码生成（脚手架、模板）",
      taskType: "code",
      targetTool: "Claude",
      difficulty: "advanced",
      authorIndex: 2,
      tags: "代码审查,Code Review,最佳实践,编程",
      viewCount: 8650,
      favoriteCount: 423,
      copyCount: 1560,
      rating: 4.9,
      reviewCount: 134,
      isFeatured: true,
      isTrending: true,
    },
    {
      title: "爆款标题生成器",
      description:
        "输入文章主题，生成10个高点击率的标题变体，涵盖不同风格和情绪。",
      content: `# 爆款标题生成器

你是一位资深的新媒体编辑，精通标题创作技巧。

## 输入信息
- 文章主题：[用户填写]
- 目标平台：[公众号/头条/知乎/小红书]
- 目标人群：[用户填写]
- 文章类型：[干货/故事/观点/盘点]

## 生成要求
请生成10个标题，每个标题使用不同的技巧：

1. **数字型**：用具体数字增加可信度
2. **疑问型**：引发读者思考
3. **对比型**：制造反差感
4. **悬念型**：激发好奇心
5. **痛点型**：戳中读者痛点
6. **利益型**：强调读者收益
7. **权威型**：借助权威背书
8. **情绪型**：调动情绪共鸣
9. **热点型**：借势热门话题
10. **争议型**：制造讨论空间

## 输出格式
每个标题附带简短的使用场景说明。`,
      categoryId: "copywriting",
      categoryName: "文案写作",
      subcategoryId: "social-media",
      subcategoryName: "新媒体推文",
      taskType: "text",
      targetTool: "ChatGPT",
      difficulty: "beginner",
      authorIndex: 1,
      tags: "标题,文案,爆款,新媒体",
      viewCount: 18920,
      favoriteCount: 1234,
      copyCount: 5670,
      rating: 4.8,
      reviewCount: 312,
      isFeatured: true,
      isTrending: true,
    },
  ];

  for (const promptData of promptsData) {
    const author = createdUsers[promptData.authorIndex];
    await prisma.prompt.create({
      data: {
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        categoryId: promptData.categoryId,
        categoryName: promptData.categoryName,
        subcategoryId: promptData.subcategoryId,
        subcategoryName: promptData.subcategoryName,
        taskType: promptData.taskType,
        targetTool: promptData.targetTool,
        difficulty: promptData.difficulty,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar || "",
        tags: promptData.tags,
        viewCount: promptData.viewCount,
        favoriteCount: promptData.favoriteCount,
        copyCount: promptData.copyCount,
        rating: promptData.rating,
        reviewCount: promptData.reviewCount,
        isFeatured: promptData.isFeatured,
        isTrending: promptData.isTrending,
      },
    });

    // 更新分类的 promptCount
    await prisma.category.update({
      where: { id: promptData.categoryId },
      data: { promptCount: { increment: 1 } },
    });

    // 更新用户的 promptCount
    await prisma.user.update({
      where: { id: author.id },
      data: { promptCount: { increment: 1 } },
    });
  }
  console.log("已创建提示词数据");

  console.log("数据库填充完成！");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
