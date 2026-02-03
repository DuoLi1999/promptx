"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Heart,
  FileText,
  Settings,
  LogOut,
  Eye,
  Copy,
  Calendar,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockPrompts } from "@/lib/data";
import { formatNumber, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, favorites } = useAuth();

  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // 获取用户收藏的提示词
  const favoritePrompts = mockPrompts.filter((p) => favorites.includes(p.id));

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={user.avatar}
              alt={user.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h1>
              <p className="text-primary-100">{user.email}</p>
              {user.bio && <p className="text-primary-200 mt-2">{user.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">
                    {favoritePrompts.length}
                  </div>
                  <div className="text-xs text-gray-500">收藏</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-xs text-gray-500">发布</div>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-primary-600 bg-primary-50 rounded-xl font-medium"
                >
                  <Heart className="w-5 h-5" />
                  我的收藏
                </Link>
                <Link
                  href="/create"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                  发布提示词
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl w-full"
                >
                  <LogOut className="w-5 h-5" />
                  退出登录
                </button>
              </nav>

              {/* Join Date */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>加入于 {formatDate(user.joinedAt)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">我的收藏</h2>
              <p className="text-gray-600 text-sm mt-1">
                你收藏了 {favoritePrompts.length} 个提示词
              </p>
            </div>

            {favoritePrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favoritePrompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/prompts/${prompt.id}`}
                    className="card-interactive p-6 group"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-primary text-xs">
                        {prompt.categoryName}
                      </span>
                      {prompt.subcategoryName && (
                        <span className="text-xs text-gray-500">
                          {prompt.subcategoryName}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {prompt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {prompt.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{formatNumber(prompt.viewCount)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Copy className="w-4 h-4" />
                          <span>{formatNumber(prompt.copyCount)}</span>
                        </span>
                      </div>
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  还没有收藏
                </h3>
                <p className="text-gray-600 mb-6">
                  浏览提示词并点击收藏按钮添加到这里
                </p>
                <Link href="/prompts" className="btn-primary">
                  浏览提示词
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
