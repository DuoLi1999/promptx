"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, Check, Mail, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register, isLoggedIn, isLoading: authLoading } = useAuth();

  // 步骤：1-输入手机/邮箱，2-验证码，3-设置密码
  const [step, setStep] = useState(1);
  const [registerType, setRegisterType] = useState<"email" | "phone">("phone");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, authLoading, router]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async () => {
    setError("");

    if (registerType === "phone" && !isPhoneValid) {
      setError("请输入有效的手机号");
      return;
    }
    if (registerType === "email" && !isEmailValid) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setIsLoading(true);

    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setCountdown(60);
    setStep(2);
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    setError("");

    if (verificationCode.length !== 6) {
      setError("请输入6位验证码");
      return;
    }

    setIsLoading(true);

    // 模拟验证（任意6位数字都通过）
    await new Promise(resolve => setTimeout(resolve, 500));

    setIsLoading(false);
    setStep(3);
  };

  // 完成注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      setError("请先同意服务条款和隐私政策");
      return;
    }

    if (!passwordChecks.every(check => check.valid)) {
      setError("密码不符合要求");
      return;
    }

    setIsLoading(true);
    setError("");

    const identifier = registerType === "email" ? email : phone;
    const result = await register(identifier, password, name, registerType);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "注册失败");
    }

    setIsLoading(false);
  };

  // 密码强度检查
  const passwordChecks = [
    { label: "至少 6 个字符", valid: password.length >= 6 },
    { label: "包含数字", valid: /\d/.test(password) },
    { label: "包含字母", valid: /[a-zA-Z]/.test(password) },
  ];

  // 手机号验证
  const isPhoneValid = /^1[3-9]\d{9}$/.test(phone);
  // 邮箱验证
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 返回上一步
  const goBack = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Prompt<span className="text-primary-600">X</span>
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="card p-8">
          {/* 步骤指示器 */}
          <div className="flex items-center justify-center mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 ${
                      step > s ? "bg-primary-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 步骤标题 */}
          <div className="text-center mb-6">
            {step === 1 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">创建账户</h1>
                <p className="text-gray-600">请输入您的手机号或邮箱</p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">验证身份</h1>
                <p className="text-gray-600">
                  验证码已发送至 {registerType === "phone" ? phone : email}
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">设置密码</h1>
                <p className="text-gray-600">请设置您的账户密码</p>
              </>
            )}
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 步骤1：输入手机/邮箱 */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Register Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRegisterType("phone")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    registerType === "phone"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  手机注册
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterType("email")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    registerType === "email"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  邮箱注册
                </button>
              </div>

              {/* Email or Phone */}
              {registerType === "phone" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    手机号码
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="请输入11位手机号"
                    className="input"
                  />
                  {phone && !isPhoneValid && (
                    <p className="text-xs text-red-500 mt-1">请输入有效的11位手机号</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input"
                  />
                  {email && !isEmailValid && (
                    <p className="text-xs text-red-500 mt-1">请输入有效的邮箱地址</p>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading || (registerType === "phone" ? !isPhoneValid : !isEmailValid)}
                className="w-full btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "发送中..." : "获取验证码"}
              </button>
            </div>
          )}

          {/* 步骤2：输入验证码 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  验证码
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入6位验证码"
                  className="input text-center text-2xl tracking-widest"
                  maxLength={6}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    验证码已发送，请查收
                  </p>
                  {countdown > 0 ? (
                    <span className="text-xs text-gray-400">{countdown}秒后重新发送</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendCode}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      重新发送
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 btn-outline py-3.5 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回
                </button>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="flex-1 btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "验证中..." : "下一步"}
                </button>
              </div>
            </div>
          )}

          {/* 步骤3：设置密码 */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="您的名字"
                  className="input"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  设置密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="设置密码"
                    className="input pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="mt-3 space-y-2">
                    {passwordChecks.map((check) => (
                      <div
                        key={check.label}
                        className={`flex items-center space-x-2 text-sm ${
                          check.valid ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 ${check.valid ? "" : "opacity-40"}`}
                        />
                        <span>{check.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  我已阅读并同意{" "}
                  <Link
                    href="/terms"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    服务条款
                  </Link>{" "}
                  和{" "}
                  <Link
                    href="/privacy"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    隐私政策
                  </Link>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 btn-outline py-3.5 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 btn-primary py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "注册中..." : "完成注册"}
                </button>
              </div>
            </form>
          )}

          {/* Login link */}
          <p className="text-center text-gray-600 mt-8">
            已有账户?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
