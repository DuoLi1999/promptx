import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Prompt<span className="text-primary-400">X</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              专业的AI提示词资源库，助力各行业提升工作效率
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="mailto:contact@promptx.com"
                className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                contact@promptx.com
              </a>
            </div>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
              <span>小红书: @PromptX</span>
              <span>抖音: @PromptX</span>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">支持</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  关于我们
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  联系我们
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  帮助中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">法律</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm hover:text-primary-400 transition-colors"
                >
                  服务条款
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} PromptX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
