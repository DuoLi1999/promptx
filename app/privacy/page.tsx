export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>

          <div className="prose-content">
            <p className="text-gray-600 mb-6">最后更新日期：2026年2月3日</p>

            <h2>1. 信息收集</h2>
            <p>我们可能收集以下类型的信息：</p>
            <ul>
              <li>账户信息：包括用户名、邮箱地址</li>
              <li>使用数据：包括浏览记录、收藏记录、复制记录</li>
              <li>设备信息：包括设备类型、操作系统、浏览器类型</li>
            </ul>

            <h2>2. 信息使用</h2>
            <p>我们使用收集的信息用于：</p>
            <ul>
              <li>提供、维护和改进我们的服务</li>
              <li>个性化用户体验</li>
              <li>发送服务相关的通知</li>
              <li>进行数据分析以改进产品</li>
            </ul>

            <h2>3. 信息共享</h2>
            <p>
              我们不会将您的个人信息出售给第三方。在以下情况下，我们可能会共享您的信息：
            </p>
            <ul>
              <li>经您明确同意</li>
              <li>法律要求</li>
              <li>保护我们的权利和财产</li>
            </ul>

            <h2>4. 数据安全</h2>
            <p>
              我们采取适当的技术和组织措施来保护您的个人信息，防止未经授权的访问、使用或披露。
            </p>

            <h2>5. Cookie 使用</h2>
            <p>
              我们使用 Cookie
              和类似技术来收集和存储信息，以便为您提供更好的服务。
              您可以通过浏览器设置来管理 Cookie 偏好。
            </p>

            <h2>6. 您的权利</h2>
            <p>您有权：</p>
            <ul>
              <li>访问您的个人信息</li>
              <li>更正不准确的信息</li>
              <li>删除您的账户和相关数据</li>
              <li>撤回同意</li>
            </ul>

            <h2>7. 联系我们</h2>
            <p>如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
            <p>邮箱：privacy@promptx.com</p>

            <h2>8. 政策更新</h2>
            <p>
              我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，
              并在生效前通知您重大变更。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
