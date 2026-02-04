"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  FileText,
  LogOut,
  Eye,
  Copy,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Wand2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatNumber, formatDate } from "@/lib/utils";

interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  categoryName: string;
  subcategoryName?: string;
  taskType: string;
  targetTool: string;
  tags: string[] | string;
  viewCount: number;
  copyCount: number;
  favoriteCount: number;
  createdAt: string;
}

// 辅助函数：确保 tags 是数组
function ensureTagsArray(tags: string[] | string): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") return tags.split(",").map(t => t.trim()).filter(Boolean);
  return [];
}

interface EditModalProps {
  prompt: Prompt;
  onClose: () => void;
  onSave: (data: Partial<Prompt>) => Promise<void>;
}

function EditModal({ prompt, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState(prompt.title);
  const [description, setDescription] = useState(prompt.description);
  const [content, setContent] = useState(prompt.content);
  const [tags, setTags] = useState(ensureTagsArray(prompt.tags).join(", "));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (title.length < 5) {
      setError("标题至少5个字符");
      return;
    }
    if (description.length < 10) {
      setError("描述至少10个字符");
      return;
    }
    if (content.length < 50) {
      setError("提示词内容至少50个字符");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        title,
        description,
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">编辑提示词</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input resize-none"
              rows={2}
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              提示词内容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input resize-none font-mono text-sm"
              rows={10}
              maxLength={10000}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签（用逗号分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input"
              placeholder="标签1, 标签2, 标签3"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button onClick={onClose} className="btn-outline">
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                保存修改
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, user, logout, favorites } = useAuth();
  const [activeTab, setActiveTab] = useState<"favorites" | "published">(
    "favorites"
  );

  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [publishedPrompts, setPublishedPrompts] = useState<Prompt[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingPublished, setIsLoadingPublished] = useState(false);

  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 获取收藏的提示词
  const fetchFavoritePrompts = useCallback(async () => {
    if (favorites.length === 0) {
      setFavoritePrompts([]);
      return;
    }

    setIsLoadingFavorites(true);
    try {
      // 逐个获取收藏的提示词详情
      const prompts = await Promise.all(
        favorites.map(async (id) => {
          const res = await fetch(`/api/prompts/${id}`);
          if (res.ok) {
            const data = await res.json();
            return data.success ? data.data : null;
          }
          return null;
        })
      );
      setFavoritePrompts(prompts.filter(Boolean));
    } catch (err) {
      console.error("获取收藏失败", err);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, [favorites]);

  // 获取用户发布的提示词
  const fetchPublishedPrompts = useCallback(async () => {
    if (!user?.id) return;

    setIsLoadingPublished(true);
    try {
      const res = await fetch(`/api/user/prompts`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPublishedPrompts(data.data);
        }
      }
    } catch (err) {
      console.error("获取发布失败", err);
    } finally {
      setIsLoadingPublished(false);
    }
  }, [user?.id]);

  // 如果未登录，重定向到登录页
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // 加载数据
  useEffect(() => {
    if (isLoggedIn) {
      fetchFavoritePrompts();
      fetchPublishedPrompts();
    }
  }, [isLoggedIn, fetchFavoritePrompts, fetchPublishedPrompts]);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
  };

  const handleSaveEdit = async (data: Partial<Prompt>) => {
    if (!editingPrompt) return;

    const res = await fetch(`/api/prompts/${editingPrompt.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "更新失败");
    }

    // 更新本地状态
    setPublishedPrompts((prev) =>
      prev.map((p) =>
        p.id === editingPrompt.id ? { ...p, ...data } : p
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个提示词吗？此操作不可恢复。")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setPublishedPrompts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(result.error || "删除失败");
      }
    } catch {
      alert("删除失败");
    } finally {
      setDeletingId(null);
    }
  };

  const renderPromptCard = (prompt: Prompt, showActions: boolean = false) => (
    <div key={prompt.id} className="card-interactive p-6 group relative">
      {/* Actions for published prompts */}
      {showActions && (
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleEdit(prompt);
            }}
            className="p-2 bg-white hover:bg-primary-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="编辑"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete(prompt.id);
            }}
            disabled={deletingId === prompt.id}
            className="p-2 bg-white hover:bg-red-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
            title="删除"
          >
            {deletingId === prompt.id ? (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      )}

      <Link href={`/prompts/${prompt.id}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="badge-primary text-xs">{prompt.categoryName}</span>
          {prompt.subcategoryName && (
            <span className="text-xs text-gray-500">{prompt.subcategoryName}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 pr-16">
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
            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{formatNumber(prompt.favoriteCount)}</span>
            </span>
          </div>
          {!showActions && (
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          )}
        </div>
      </Link>
    </div>
  );

  const renderEmptyState = (type: "favorites" | "published") => (
    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {type === "favorites" ? (
          <Heart className="w-10 h-10 text-gray-400" />
        ) : (
          <FileText className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {type === "favorites" ? "还没有收藏" : "还没有发布"}
      </h3>
      <p className="text-gray-600 mb-6">
        {type === "favorites"
          ? "浏览提示词并点击收藏按钮添加到这里"
          : "使用优化助手创作并发布你的第一个提示词"}
      </p>
      {type === "favorites" ? (
        <Link href="/prompts" className="btn-primary">
          浏览提示词
        </Link>
      ) : (
        <Link href="/#optimizer" className="btn-primary inline-flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          去创作
        </Link>
      )}
    </div>
  );

  const renderLoading = () => (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
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
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`text-center p-4 rounded-xl transition-colors ${
                    activeTab === "favorites"
                      ? "bg-primary-50 border-2 border-primary-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {favoritePrompts.length}
                  </div>
                  <div className="text-xs text-gray-500">收藏</div>
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`text-center p-4 rounded-xl transition-colors ${
                    activeTab === "published"
                      ? "bg-primary-50 border-2 border-primary-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {publishedPrompts.length}
                  </div>
                  <div className="text-xs text-gray-500">发布</div>
                </button>
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
                  href="/#optimizer"
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                  创建提示词
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
                  <span>加入于 {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === "favorites" ? "我的收藏" : "我的发布"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {activeTab === "favorites"
                  ? `你收藏了 ${favoritePrompts.length} 个提示词`
                  : `你发布了 ${publishedPrompts.length} 个提示词`}
              </p>
            </div>

            {activeTab === "favorites" ? (
              isLoadingFavorites ? (
                renderLoading()
              ) : favoritePrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoritePrompts.map((prompt) => renderPromptCard(prompt, false))}
                </div>
              ) : (
                renderEmptyState("favorites")
              )
            ) : isLoadingPublished ? (
              renderLoading()
            ) : publishedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {publishedPrompts.map((prompt) => renderPromptCard(prompt, true))}
              </div>
            ) : (
              renderEmptyState("published")
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPrompt && (
        <EditModal
          prompt={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
