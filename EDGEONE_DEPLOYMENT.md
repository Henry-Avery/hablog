# EdgeOne 部署指南

本文档提供在腾讯云 EdgeOne 平台部署 Astrokeys 博客的完整指南。

## 📋 前置要求

- ✅ GitHub 账号和代码仓库
- ✅ 腾讯云账号
- ✅ 已完成本地开发和测试
- ✅ 已配置 GitHub OAuth（如需要 CMS 功能）

## 🚀 部署步骤

### 步骤 1: 准备 GitHub 仓库

1. 确保你的代码已推送到 GitHub
2. 确认 `pnpm-lock.yaml` 已提交（EdgeOne 需要它来识别包管理器）
3. 确认 `.gitignore` 包含以下内容：
   ```
   dist/
   .env
   .env.production
   node_modules/
   .astro/
   ```

### 步骤 2: 创建 EdgeOne 项目

1. 登录腾讯云 EdgeOne 控制台
2. 点击"新建站点"或"新建项目"
3. 选择"从 Git 仓库导入"
4. 授权 EdgeOne 访问你的 GitHub 账号
5. 选择 `astrokeys` 仓库

### 步骤 3: 配置构建设置

在 EdgeOne 项目配置页面，填写以下信息：

#### 基础配置

- **框架预设**: `Astro`（或选择 `Other`）
- **构建命令**: `pnpm build`
- **输出目录**: `dist`
- **安装命令**: `pnpm install`（通常自动检测）
- **Node.js 版本**: `18` 或更高（推荐 `22`）

#### package.json 脚本确认

确保 `package.json` 包含：
```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist"
  }
}
```

### 步骤 4: 配置环境变量

在 EdgeOne 控制台的"环境变量"设置中添加以下变量：

#### 必需的环境变量

| 变量名 | 值 | 说明 |
|--------|---|------|
| `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER` | 你的 GitHub 用户名 | Keystatic CMS GitHub 所有者 |
| `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME` | 仓库名称 | 例如: `astrokeys` |
| `PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | 从 GitHub OAuth App 获取 |
| `PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret | 从 GitHub OAuth App 获取（标记为敏感） |

#### 可选的环境变量

| 变量名 | 值 | 说明 |
|--------|---|------|
| `PUBLIC_SITE_URL` | 你的域名 | 例如: `https://blog.example.com` |
| `UMAMI_API_KEY` | Umami API 密钥 | 如果使用 Umami 统计 |
| `INDEXNOW_KEY` | IndexNow API 密钥 | 用于 SEO 索引提交 |

#### 环境变量设置步骤

1. 在 EdgeOne 项目设置中找到"环境变量"
2. 点击"添加变量"
3. 输入变量名和值
4. 对于 `PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET`，勾选"敏感信息"选项
5. 保存设置

### 步骤 5: 更新 GitHub OAuth 回调 URL

1. 访问 https://github.com/settings/developers
2. 找到你的 OAuth App
3. 添加生产环境回调 URL：
   ```
   https://your-domain.com/api/keystatic/github/oauth/callback
   ```
4. 如果使用 EdgeOne 提供的默认域名：
   ```
   https://your-project.edgeone.com/api/keystatic/github/oauth/callback
   ```
5. 保存设置

### 步骤 6: 触发部署

1. 在 EdgeOne 控制台点击"部署"或"重新部署"
2. 等待构建完成（通常 2-5 分钟）
3. 查看构建日志，确保没有错误

#### 预期构建流程

```bash
1. 克隆仓库
2. 安装依赖 (pnpm install)
3. 运行构建 (pnpm build)
   3.1. Astro 静态生成 (astro build)
   3.2. Pagefind 索引生成 (pagefind --site dist)
4. 部署 dist 目录
```

### 步骤 7: 配置自定义域名（可选）

1. 在 EdgeOne 控制台找到"域名管理"
2. 点击"添加域名"
3. 输入你的域名（例如：`blog.example.com`）
4. 按照指引配置 DNS 记录：
   - 类型：`CNAME`
   - 名称：`blog`（或 `@` 如果是根域名）
   - 值：EdgeOne 提供的 CNAME 值
5. 等待 DNS 生效（通常 10-30 分钟）
6. EdgeOne 会自动配置 HTTPS 证书

### 步骤 8: 验证部署

访问你的网站，检查以下功能：

- ✅ 首页正常显示
- ✅ 文章页面可访问
- ✅ 搜索功能正常（访问 `/search`）
- ✅ Keystatic CMS 可登录（访问 `/keystatic`）
- ✅ GitHub OAuth 认证流程正常
- ✅ Markdown Callouts 正常渲染
- ✅ 数学公式显示正常
- ✅ 渐变按钮样式正确
- ✅ 自定义滚动条生效

## 🔧 持续部署配置

EdgeOne 会自动监听 GitHub 仓库的变更：

### 自动部署触发条件

- ✅ 推送代码到 `main` 分支
- ✅ 合并 Pull Request
- ✅ 创建新的 Git Tag

### 部署分支设置

1. 在 EdgeOne 控制台找到"Git 设置"
2. 设置生产分支：`main`（或你的主分支名称）
3. 可选：配置预览分支（例如 `develop`）

## 🐛 常见问题排查

### 问题 1: 构建失败 - "pnpm: command not found"

**原因**：EdgeOne 未识别到 `pnpm-lock.yaml`

**解决方案**：
1. 确保 `pnpm-lock.yaml` 已提交到仓库
2. 在 EdgeOne 项目设置中手动指定安装命令：`pnpm install`

### 问题 2: 构建成功但页面 404

**原因**：输出目录配置错误

**解决方案**：
1. 检查 EdgeOne 配置中的"输出目录"是否为 `dist`
2. 检查构建日志，确认 `dist` 目录已生成

### 问题 3: 搜索功能不工作

**原因**：Pagefind 索引未生成或未部署

**解决方案**：
1. 检查构建命令是否包含 `pagefind --site dist`
2. 查看构建日志中是否有 Pagefind 相关输出
3. 检查 `dist/_pagefind` 目录是否存在

### 问题 4: GitHub OAuth 登录失败

**原因**：回调 URL 配置错误或环境变量未设置

**解决方案**：
1. 检查 EdgeOne 环境变量中的 `PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID` 和 `SECRET`
2. 确认 GitHub OAuth App 的回调 URL 包含生产环境域名
3. 格式必须是：`https://your-domain.com/api/keystatic/github/oauth/callback`

### 问题 5: 样式不正确或 CSS 缺失

**原因**：CSS 导入路径错误或构建失败

**解决方案**：
1. 检查 `Layout.astro` 中的 `@import` 路径
2. 确认所有 CSS 文件都已提交到仓库
3. 查看构建日志中是否有 CSS 相关错误

### 问题 6: 数学公式不显示

**原因**：KaTeX CSS 未加载

**解决方案**：
1. 确认 `Layout.astro` 中导入了 `katex/dist/katex.min.css`
2. 检查构建产物中是否包含 KaTeX 样式文件

### 问题 7: 环境变量未生效

**原因**：环境变量名称错误或未以 `PUBLIC_` 开头

**解决方案**：
1. Astro 中客户端可访问的环境变量必须以 `PUBLIC_` 开头
2. 服务端环境变量不需要前缀，但 EdgeOne 静态部署只能使用构建时变量
3. 修改环境变量后需要重新部署

## 📊 性能优化建议

### 1. 启用 EdgeOne CDN 加速

- EdgeOne 默认启用 CDN
- 静态资源自动缓存
- 建议缓存策略：HTML (5分钟), CSS/JS (1天), 图片 (7天)

### 2. 图片优化

- 使用 Astro 的 `<Image>` 组件自动优化
- 启用 WebP 格式转换
- 配置响应式图片

### 3. 构建优化

确保 `package.json` 的构建脚本优化：
```json
{
  "scripts": {
    "build": "astro build && pagefind --site dist",
    "build:prod": "NODE_ENV=production pnpm build"
  }
}
```

## 🔐 安全建议

1. **环境变量保护**
   - 永远不要在代码中硬编码密钥
   - 使用 EdgeOne 的"敏感信息"功能保护 Secret

2. **HTTPS 强制**
   - EdgeOne 自动配置 SSL
   - 确保 HTTP 自动重定向到 HTTPS

3. **内容安全策略（CSP）**
   - 考虑添加 CSP 头保护网站
   - 在 `public/_headers` 中配置

4. **访问限制**
   - `/keystatic` 路由已由 GitHub OAuth 保护
   - 只有授权用户可以编辑内容

## 📈 监控和分析

### 推荐工具

1. **EdgeOne 内置分析**
   - 访问量统计
   - 带宽使用
   - 错误日志

2. **Umami 分析**（可选）
   - 隐私友好的分析工具
   - 配置环境变量 `UMAMI_API_KEY`

3. **Google Search Console**
   - 提交 Sitemap: `https://your-domain.com/sitemap-index.xml`
   - 监控搜索表现

## 🔄 回滚和版本管理

### 快速回滚

1. 在 EdgeOne 控制台找到"部署历史"
2. 选择之前的成功部署
3. 点击"回滚到此版本"

### Git Tag 部署

为生产部署打标签：
```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 📚 相关资源

- [Astro 文档](https://docs.astro.build)
- [Keystatic 文档](https://keystatic.com/docs)
- [EdgeOne 文档](https://cloud.tencent.com/document/product/1552)
- [Pagefind 文档](https://pagefind.app/)

## 💡 下一步

部署成功后，你可以：

1. ✅ 开始通过 `/keystatic` 编辑内容
2. ✅ 配置自定义域名
3. ✅ 设置 SEO 优化
4. ✅ 添加更多功能（评论系统、友链页面等）
5. ✅ 监控网站性能和访问量

---

如有任何问题，请参考：
- GitHub Issues: https://github.com/your-repo/issues
- EdgeOne 技术支持: https://console.cloud.tencent.com/workorder
