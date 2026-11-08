# Vercel 部署完整指南

## 当前状态

✅ 代码已提交到本地 Git
⏸️ 需要推送到 GitHub（需要身份验证）
⏸️ 等待 Vercel 部署配置

---

## 阶段 1: GitHub 身份验证与推送

### 选项 A: 使用 Personal Access Token（推荐，最快）

1. **创建 Personal Access Token:**
   - 访问：https://github.com/settings/tokens/new
   - Token name: `astrokeys-deployment`
   - Expiration: 90 days（或根据需要）
   - Select scopes:
     - ✅ `repo` （所有权限）
     - ✅ `workflow`
   - 点击 "Generate token"
   - **复制token（只显示一次！）**

2. **配置 Git 使用 Token:**
   ```bash
   # 更新远程 URL 以使用 token
   git remote set-url origin https://YOUR_TOKEN@github.com/TheWebsiteGuy/astrokeys.git

   # 或者使用交互式方式（会提示输入用户名和密码）
   git push origin main
   # Username: 你的 GitHub 用户名
   # Password: 粘贴你的 Personal Access Token
   ```

3. **推送代码:**
   ```bash
   git push origin main
   ```

### 选项 B: 使用 SSH 密钥（更安全，长期推荐）

1. **生成 SSH 密钥:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 按 Enter 使用默认位置
   # 设置密码（可选）
   ```

2. **添加 SSH 密钥到 GitHub:**
   ```bash
   # 复制公钥
   cat ~/.ssh/id_ed25519.pub

   # 访问 https://github.com/settings/keys
   # 点击 "New SSH key"
   # 粘贴公钥内容
   ```

3. **更改远程 URL 为 SSH:**
   ```bash
   git remote set-url origin git@github.com:TheWebsiteGuy/astrokeys.git
   git push origin main
   ```

---

## 阶段 2: 创建 GitHub OAuth App

在推送代码后，需要配置 GitHub OAuth 让 Keystatic CMS 工作。

1. **访问 GitHub OAuth Apps:**
   - 网址：https://github.com/settings/developers
   - 点击 "New OAuth App"

2. **填写应用信息:**
   ```
   Application name: henryavery.cn Blog
   Homepage URL: http://localhost:4321
   Application description: Keystatic CMS for henryavery.cn blog
   Authorization callback URL: http://localhost:4321/api/keystatic/github/oauth/callback
   ```

3. **获取凭证:**
   - 点击 "Register application"
   - 复制 **Client ID**
   - 点击 "Generate a new client secret"
   - 复制 **Client Secret**（只显示一次！）

4. **更新本地 .env 文件:**
   ```bash
   # 编辑 .env 文件
   nano .env

   # 或使用 VS Code
   code .env
   ```

   添加以下内容：
   ```env
   PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=TheWebsiteGuy
   PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=astrokeys
   PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID=你的_Client_ID
   PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET=你的_Client_Secret
   PUBLIC_SITE_URL=http://localhost:4321
   ```

5. **测试本地登录:**
   ```bash
   # 重启开发服务器
   pnpm dev

   # 访问 http://localhost:4321/keystatic
   # 点击 "Sign in with GitHub"
   # 测试是否能成功登录
   ```

---

## 阶段 3: 部署到 Vercel

### 方法 A: 使用 Vercel CLI（推荐）

1. **安装 Vercel CLI:**
   ```bash
   pnpm add -g vercel
   ```

2. **登录 Vercel:**
   ```bash
   vercel login
   # 选择登录方式（GitHub、GitLab、Email 等）
   ```

3. **部署项目:**
   ```bash
   vercel

   # 回答配置问题：
   # ? Set up and deploy "~/Desktop/astrokeys"? [Y/n] Y
   # ? Which scope? 选择你的账户
   # ? Link to existing project? [y/N] N
   # ? What's your project's name? henryavery-cn
   # ? In which directory is your code located? ./
   ```

4. **配置环境变量:**
   ```bash
   # 添加 GitHub OAuth 凭证
   vercel env add PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
   # 输入: TheWebsiteGuy

   vercel env add PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
   # 输入: astrokeys

   vercel env add PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID
   # 输入: 你的 Client ID

   vercel env add PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET
   # 输入: 你的 Client Secret

   vercel env add PUBLIC_SITE_URL
   # 输入: https://你的域名.vercel.app
   ```

5. **触发生产部署:**
   ```bash
   vercel --prod
   ```

### 方法 B: 使用 Vercel Dashboard（可视化）

1. **访问 Vercel 并登录:**
   - 网址：https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目:**
   - 点击 "Add New..." → "Project"
   - 选择 "Import Git Repository"
   - 找到 `TheWebsiteGuy/astrokeys` 并点击 "Import"

3. **配置项目:**
   ```
   Framework Preset: Astro
   Root Directory: ./
   Build Command: pnpm build
   Output Directory: dist
   Install Command: pnpm install
   ```

4. **添加环境变量:**
   在 "Environment Variables" 部分添加：
   ```
   PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER = TheWebsiteGuy
   PUBLIC_KEYSTATIC_GITHUB_REPO_NAME = astrokeys
   PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID = 你的_Client_ID
   PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET = 你的_Client_Secret
   PUBLIC_SITE_URL = https://你的域名.vercel.app
   ```

5. **部署:**
   - 点击 "Deploy"
   - 等待构建完成（约 2-3 分钟）

---

## 阶段 4: 更新 OAuth 回调 URL

部署成功后，你会获得一个 Vercel URL（如 `https://henryavery-cn.vercel.app`）。

1. **回到 GitHub OAuth App 设置:**
   - 访问：https://github.com/settings/developers
   - 点击你的 OAuth App

2. **更新回调 URL:**
   ```
   Homepage URL: https://你的域名.vercel.app
   Authorization callback URL: https://你的域名.vercel.app/api/keystatic/github/oauth/callback
   ```

3. **保存更改**

4. **更新 Vercel 环境变量:**
   ```bash
   # 使用 CLI
   vercel env rm PUBLIC_SITE_URL production
   vercel env add PUBLIC_SITE_URL production
   # 输入: https://你的域名.vercel.app

   # 重新部署
   vercel --prod
   ```

   或在 Dashboard:
   - 进入项目 Settings → Environment Variables
   - 编辑 `PUBLIC_SITE_URL`
   - 改为 `https://你的域名.vercel.app`
   - 点击 "Redeploy" 触发重新部署

---

## 阶段 5: 验证部署

1. **访问生产网站:**
   ```
   https://你的域名.vercel.app
   ```

2. **测试清单:**
   - [ ] 首页加载正常
   - [ ] 侧边栏 widgets 显示正常
   - [ ] 文章列表页面工作
   - [ ] 单篇文章页面显示
   - [ ] 搜索功能（/search）
   - [ ] Archive 页面（/archive）
   - [ ] Keystatic CMS 登录（/keystatic）
   - [ ] GitHub OAuth 授权流程
   - [ ] 在 Keystatic 中编辑文章
   - [ ] 发布新文章测试
   - [ ] 检查图片加载
   - [ ] 测试数学公式渲染
   - [ ] 测试 Markdown callouts

3. **检查构建日志:**
   ```bash
   # 使用 CLI 查看日志
   vercel logs

   # 或在 Dashboard:
   # 项目页面 → Deployments → 点击最新部署 → 查看 "Build Logs"
   ```

---

## 常见问题

### 1. 构建失败: "pnpm: command not found"

**解决方案:**
在 Vercel Dashboard 的项目设置中：
- Settings → General → Node.js Version
- 选择 18.x 或 20.x

### 2. Keystatic 无法登录

**检查:**
- OAuth App 的回调 URL 是否正确
- 环境变量是否正确设置
- Client Secret 是否正确（复制时没有多余空格）

### 3. 图片无法显示

**检查:**
- 图片路径是否正确
- 图片文件是否已推送到 GitHub
- 运行 `pnpm run check:images` 检查图片目录；此命令不会删除文件

### 4. 搜索功能不工作

**原因:** Pagefind 在本地构建时生成索引

**解决方案:**
确保 `package.json` 中的 build 命令包含 pagefind:
```json
"build": "astro build && pagefind --site .vercel/output/static"
```

### 5. 推送到 GitHub 失败

**Error:** `Permission denied`

**解决方案:**
- 检查 Personal Access Token 是否有效
- 确保 token 有 `repo` 权限
- 或配置 SSH 密钥（见上方指南）

---

## 自动部署设置

配置完成后，每次推送到 GitHub 都会自动触发 Vercel 部署。

```bash
# 未来的工作流程
git add .
git commit -m "feat: add new post"
git push origin main

# Vercel 会自动：
# 1. 检测到推送
# 2. 拉取最新代码
# 3. 运行 pnpm install
# 4. 执行 pnpm build
# 5. 部署到生产环境
# 6. 大约 2-3 分钟后网站更新
```

---

## 自定义域名（可选）

如果你有自己的域名（如 henryavery.cn）：

1. **在 Vercel 添加域名:**
   - Project Settings → Domains
   - 输入你的域名
   - 点击 "Add"

2. **配置 DNS:**
   在你的域名提供商处添加以下记录：
   ```
   类型: CNAME
   名称: @ (或 www)
   值: cname.vercel-dns.com
   ```

3. **等待 DNS 生效:**
   - 通常需要 5-30 分钟
   - Vercel 会自动配置 SSL 证书

4. **更新 OAuth 回调 URL:**
   - 回到 GitHub OAuth App
   - 更新为你的自定义域名

---

## 性能优化建议

### 1. 启用 Analytics

```bash
# 安装 Vercel Analytics
pnpm add @vercel/analytics
```

### 2. 图片优化

Astro 已经使用 `<Image>` 组件自动优化，Vercel 会自动缓存。

### 3. 启用边缘缓存

在 `vercel.json` 中配置（如果需要）：
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 下一步

部署成功后，你可能想要：

1. **配置自定义域名**
2. **设置 Analytics 追踪访问数据**
3. **添加更多文章内容**
4. **优化 SEO 设置**
5. **配置 sitemap 和 robots.txt**
6. **集成评论系统（如 Giscus）**

---

## 支持

如果遇到问题：
- Vercel 文档：https://vercel.com/docs
- Astro 文档：https://docs.astro.build
- Keystatic 文档：https://keystatic.com/docs

---

**祝部署顺利！** 🚀

如果你完成了推送到 GitHub，接下来运行：
```bash
vercel
```
然后继续按照本指南的阶段 3 操作即可。
