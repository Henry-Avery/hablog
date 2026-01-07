# 🔧 Keystatic 配置指南

## 本地开发模式（推荐先使用）

1. **保持 `.env` 文件中的 GitHub 配置为空**
2. **访问** `http://localhost:4321/keystatic/`
3. **直接编辑内容**，更改会保存到本地文件
4. **使用 git 提交更改**

## 在线编辑模式（部署后使用）

### 第一步：创建 GitHub OAuth App

1. 访问 [GitHub OAuth Apps](https://github.com/settings/applications/new)
2. 填写信息：
   - **Application name**: `Astrokeys CMS`
   - **Homepage URL**: `https://你的域名.com`
   - **Authorization callback URL**: `https://你的域名.com/api/keystatic/github/oauth/callback`
3. 点击 **Register application**
4. 复制 **Client ID** 和生成 **Client Secret**

### 第二步：配置环境变量

在 `.env` 文件中填入：

```env
PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER=你的GitHub用户名
PUBLIC_KEYSTATIC_GITHUB_REPO_NAME=astrokeys
PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID=你的Client_ID
PUBLIC_KEYSTATIC_GITHUB_CLIENT_SECRET=你的Client_Secret
PUBLIC_SITE_URL=https://你的域名.com
```

### 第三步：部署到 EdgeOne

1. **在 EdgeOne 配置环境变量**（与 `.env` 相同）
2. **部署站点**
3. **访问** `https://你的域名.com/keystatic/`
4. **使用 GitHub 登录** 进行在线编辑

## 工作流程

### 本地开发
```bash
pnpm dev
# 访问 http://localhost:4321/keystatic/
# 直接编辑内容
git add .
git commit -m "Update content"
git push
```

### 在线编辑（部署后）
1. 访问 `https://你的域名.com/keystatic/`
2. 使用 GitHub 登录
3. 在线编辑内容
4. 保存后自动创建 PR 或直接提交到 main 分支
5. EdgeOne 自动重新部署

## 注意事项

- ⚠️ **本地模式**：内容保存在本地，需要手动 git 提交
- ✅ **GitHub 模式**：内容直接提交到 GitHub，自动触发部署
- 🔒 **安全性**：
  - Client Secret 应该保密，不要提交到 git
  - 导航栏的 Admin 按钮已隐藏（无图标无文字），只有你知道位置
  - 也可以直接访问 URL：本地 `http://localhost:4321/keystatic/`，线上 `https://你的域名.com/keystatic/`
- 📝 **权限**：GitHub 账户需要有仓库的写入权限
