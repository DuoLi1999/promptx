import { removeToken } from "@/lib/auth/config";
import { successResponse, errorResponse } from "@/lib/api/responses";

export async function POST() {
  try {
    await removeToken();
    return successResponse({ message: "退出登录成功" });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("退出登录失败", 500);
  }
}
