import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // 分类图标背景色
    "bg-blue-100",
    "text-blue-600",
    "bg-red-100",
    "text-red-600",
    "bg-green-100",
    "text-green-600",
    "bg-purple-100",
    "text-purple-600",
    "bg-indigo-100",
    "text-indigo-600",
    "bg-orange-100",
    "text-orange-600",
    "bg-teal-100",
    "text-teal-600",
    "bg-pink-100",
    "text-pink-600",
    "bg-yellow-100",
    "text-yellow-600",
    "bg-cyan-100",
    "text-cyan-600",
    "bg-rose-100",
    "text-rose-600",
    "bg-violet-100",
    "text-violet-600",
    "bg-amber-100",
    "text-amber-600",
    "bg-emerald-100",
    "text-emerald-600",
    "bg-sky-100",
    "text-sky-600",
    "bg-lime-100",
    "text-lime-600",
    "bg-slate-100",
    "text-slate-600",
    "bg-stone-100",
    "text-stone-600",
    "bg-fuchsia-100",
    "text-fuchsia-600",
  ],
  theme: {
    extend: {
      colors: {
        // 飞书蓝色系
        primary: {
          50: "#e8f0ff",
          100: "#d4e1ff",
          200: "#b3c7ff",
          300: "#85a3ff",
          400: "#5b8cff",
          500: "#3370ff", // 飞书主色
          600: "#2859e6",
          700: "#1e45cc",
          800: "#1635b3",
          900: "#0e2899",
          950: "#091a66",
        },
        // 紫色系 - 飞书蓝色的补充
        purple: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        // 绿色系 - 成功/完成状态
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        // 橙色系 - 警告/高亮
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        blob: "blob 7s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
