# PromptX

专业的 AI 提示词资源库，覆盖 20+ 职业领域。

## 特性

- 🎯 **20+ 职业分类**: 科研学术、视频创作、数据分析、程序开发等
- 📝 **100+ 细分场景**: 每个分类都有详细的子场景
- 🔍 **智能筛选**: 按分类、难度、工具等多维度筛选
- 📋 **一键复制**: 即用即走，提升效率
- 🎨 **现代 UI**: 响应式设计，支持移动端

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 生产构建

```bash
npm run build
npm run start
```

## 项目结构

```
promptx/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── prompts/           # 提示词列表和详情
│   ├── categories/        # 分类列表和详情
│   ├── login/             # 登录页
│   ├── signup/            # 注册页
│   ├── about/             # 关于页面
│   └── ...
├── components/            # React 组件
│   ├── Header.tsx        # 顶部导航
│   ├── Footer.tsx        # 底部
│   └── home/             # 首页组件
├── lib/                   # 工具函数和数据
│   ├── data.ts           # 示例数据
│   ├── categories.ts     # 分类数据
│   └── utils.ts          # 工具函数
├── types/                 # TypeScript 类型定义
│   └── index.ts
└── public/               # 静态资源
```

## 分类体系

项目包含以下主要分类：

1. 科研学术 - 选题、文献综述、论文写作、投稿回复
2. 视频创作 - 脚本、分镜、剪辑、平台运营
3. 数据分析 - 指标体系、SQL、可视化、实验分析
4. 文案写作 - 品牌文案、新媒体、广告创意
5. 程序开发 - 需求、架构、代码、测试、DevOps
6. 市场营销 - 调研、用户画像、品牌策略
7. 产品管理 - 用户研究、PRD、版本规划
8. 设计创意 - UI/UX、视觉设计、设计系统
9. 教育培训 - 课程设计、教案、题库
10. 电商运营 - 选品、详情页、直播
11. 健康医疗 - 科普、文献、患教材料
12. 音乐艺术 - 作曲、歌词、乐理
    ... 以及更多职业类别

## 许可证

MIT License
