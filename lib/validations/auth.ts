import { z } from "zod";

// 注册验证
export const registerSchema = z.object({
  email: z.string().min(1, "邮箱不能为空").email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
  name: z.string().min(2, "用户名至少2个字符").max(50, "用户名最多50个字符"),
});

// 登录验证
export const loginSchema = z.object({
  email: z.string().min(1, "邮箱不能为空").email("请输入有效的邮箱地址"),
  password: z.string().min(1, "密码不能为空"),
});

// 更新用户资料验证
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "用户名至少2个字符")
    .max(50, "用户名最多50个字符")
    .optional(),
  bio: z.string().max(500, "个人简介最多500个字符").optional(),
  avatar: z.string().url("请输入有效的头像URL").optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
