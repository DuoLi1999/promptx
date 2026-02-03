import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "PromptX - 专业AI提示词资源库",
  description:
    "按职业分类的高质量AI提示词库，覆盖科研、自媒体、数据分析、程序开发等20+领域，帮助您提升AI使用效率",
  keywords: "prompt, AI提示词, ChatGPT, Claude, 提示词模板, AI助手",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
