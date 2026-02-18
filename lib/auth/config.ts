import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from "jose";
import { cookies } from "next/headers";

function getSecretKey(): Uint8Array {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error(
      "JWT_SECRET environment variable is required. Please set it in your .env file."
    );
  }
  if (secretKey.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters long for security."
    );
  }
  return new TextEncoder().encode(secretKey);
}

export interface JWTPayload extends JoseJWTPayload {
  userId: string;
  email?: string;
  phone?: string;
}

// 生成 JWT token
export async function encrypt(payload: {
  userId: string;
  email?: string;
  phone?: string;
}): Promise<string> {
  const key = getSecretKey();
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

// 验证 JWT token
export async function decrypt(token: string): Promise<JWTPayload | null> {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// 从 cookies 获取 token
export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}

// 设置 token 到 cookies
export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// 删除 token
export async function removeToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
