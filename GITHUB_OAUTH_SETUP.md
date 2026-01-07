# GitHub OAuth 配置指南

本项目使用 GitHub OAuth 来保护 Keystatic CMS 编辑器。只有授权的 GitHub 用户才能访问 `/keystatic` 进行内容编辑。

## 步骤 1: 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App" 或 "New GitHub App"
3. 填写应用信息：

### 本地开发配置

- **Application name**: `Astrokeys CMS (Development)`
- **Homepage URL**: `http://localhost:4321`
- **Authorization callback URL**: `http://localhost:4321/api/keystatic/github/oauth/callback`

### 生产环境配置

- **Application name**: `Astrokeys CMS (Production)`
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://your-domain.com/api/keystatic/github/oauth/callback`

## 步骤 2: 获取凭证

创建 OAuth App 后，你会看到：
- **Client ID** - 复制这个值
- **Client Secret** - 点击 "Generate a new client secret" 并复制

## 步骤 3: 配置环境变量

编辑 `.env` 文件（已在 .gitignore 中，不会被提交）：

```bash
PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=你的GitHub用户名
PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=你的仓库名称
PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID=你的Client_ID
PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET=你的Client_Secret
```

### 示例：

```bash
PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=henry
PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=astrokeys
PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID=Iv1.a1b2c3d4e5f6g7h8
PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET=1234567890abcdef1234567890abcdef12345678
```

## 步骤 4: 测试配置

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问 http://localhost:4321/keystatic

3. 你应该看到 "Sign in with GitHub" 按钮

4. 点击按钮，授权应用访问你的 GitHub

5. 授权成功后会重定向回 Keystatic CMS 编辑器

## 步骤 5: EdgeOne 部署配置

部署到 EdgeOne 时，需要在平台的环境变量设置中添加上述四个变量。

### EdgeOne 环境变量配置：

1. 进入 EdgeOne 控制台
2. 找到你的项目设置
3. 添加环境变量：
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER` = 你的用户名
   - `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME` = 仓库名
   - `PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID` = Client ID
   - `PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET` = Client Secret（标记为敏感信息）

4. 重要：回到 GitHub OAuth App 设置，添加生产环境回调 URL

## 步骤 6: 权限说明

GitHub OAuth 配置后：
- ✅ 只有你（仓库所有者）可以编辑内容
- ✅ 协作者（如果有）也可以登录编辑
- ✅ 所有人仍可正常浏览网站内容
- ✅ 仅 `/keystatic` 路由受保护

## 故障排除

### 问题 1: "redirect_uri_mismatch" 错误

**原因**：回调 URL 配置不匹配

**解决**：
1. 检查 GitHub OAuth App 的回调 URL 设置
2. 确保格式为：`http://localhost:4321/api/keystatic/github/oauth/callback`（本地）
3. 或：`https://your-domain.com/api/keystatic/github/oauth/callback`（生产）

### 问题 2: 环境变量未生效

**原因**：环境变量未正确加载

**解决**：
1. 确保 `.env` 文件在项目根目录
2. 重启开发服务器
3. 检查变量名称是否拼写正确（区分大小写）

### 问题 3: "Unauthorized" 错误

**原因**：Client Secret 错误或过期

**解决**：
1. 在 GitHub 重新生成 Client Secret
2. 更新 `.env` 文件
3. 重启开发服务器

## 回退到本地模式

如果需要临时禁用 GitHub OAuth（例如离线开发）：

1. 在 `.env` 文件中注释掉或删除这些变量：
   ```bash
   # PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=
   # PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=
   # PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID=
   # PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET=
   ```

2. 重启开发服务器

3. Keystatic 将自动切换回本地存储模式（无需认证）

## 安全提示

⚠️ **重要**：
- 永远不要将 `.env` 文件提交到 Git
- 永远不要在代码中硬编码 Client Secret
- 定期轮换 Client Secret
- 只授权信任的协作者访问你的 GitHub 仓库
