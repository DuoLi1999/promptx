import { NextResponse } from "next/server";

interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// 成功响应
export function successResponse<T>(
  data: T,
  status: number = 200,
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

// 错误响应
export function errorResponse(
  message: string,
  status: number = 400,
  details?: unknown,
): NextResponse<ErrorResponse> {
  const body: ErrorResponse = { success: false, error: message };
  if (details !== undefined) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

// 分页响应
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// 常用错误响应
export const unauthorized = () => errorResponse("请先登录", 401);
export const forbidden = () => errorResponse("没有权限执行此操作", 403);
export const notFound = (resource: string = "资源") =>
  errorResponse(`${resource}不存在`, 404);
export const validationError = (details: unknown) =>
  errorResponse("数据验证失败", 400, details);
export const serverError = (message: string = "服务器内部错误") =>
  errorResponse(message, 500);
