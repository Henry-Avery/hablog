# 🎨 新功能快速使用指南

## 📍 查看所有新功能

访问 **功能展示页面** 查看所有迁移的特性：

```
http://localhost:4321/features-demo
```

或点击导航栏的 **"功能展示"** 链接

---

## 🎯 各功能使用方法

### 1. 渐变按钮

在任何 `.astro` 或 `.html` 文件中使用：

```html
<button class="btn-gradient-primary">主要按钮</button>
<button class="btn-gradient-success">成功按钮</button>
<button class="btn-gradient-warning">警告按钮</button>
<button class="btn-gradient-danger">危险按钮</button>
<button class="btn-gradient-info">信息按钮</button>
<button class="btn-gradient-secondary">次要按钮</button>
```

**可用样式**:
- `btn-gradient-primary` - 主要（蓝色）
- `btn-gradient-success` - 成功（绿色）
- `btn-gradient-warning` - 警告（橙色）
- `btn-gradient-danger` - 危险（红色）
- `btn-gradient-info` - 信息（青色）
- `btn-gradient-secondary` - 次要（紫色）

---

### 2. OKLCH 色彩卡片

```html
<div class="mizuki-theme">
  <div class="mizuki-card">
    <h3>卡片标题</h3>
    <p>卡片内容</p>
  </div>
</div>
```

**特性**:
- 自动适配亮色/暗色模式
- 悬停时有阴影和位移效果
- 使用现代 OKLCH 色彩空间

---

### 3. Markdown Callouts

在你的 `.md` 或 `.mdoc` 文章中使用：

```markdown
:::note
这是一个普通提示
:::

:::tip
这是一个技巧提示
💡 用于分享有用的小贴士
:::

:::important
这是一个重要提示
⭐ 用于强调关键信息
:::

:::warning
这是一个警告提示
⚠️ 用于提醒注意事项
:::

:::caution
这是一个危险提示
🚫 用于警告严重问题
:::
```

**支持的类型**:
- `note` - 蓝色，普通提示
- `tip` - 绿色，技巧提示
- `important` - 紫色，重要信息
- `warning` - 橙色，警告
- `caution` - 红色，危险

---

### 4. 数学公式（KaTeX）

在 Markdown 文件中使用：

**行内公式**:
```markdown
这是一个行内公式: $E = mc^2$
```

**块级公式**:
```markdown
$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$
```

**更多示例**:
```markdown
积分: $\int_0^\infty e^{-x^2} dx$

矩阵:
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$

求和:
$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

---

### 5. 全文搜索

**访问搜索页面**:
```
http://localhost:4321/search
```

**或者**: 点击导航栏右上角的 🔍 搜索图标

**功能**:
- 实时搜索结果
- 高亮匹配内容
- 快速跳转到文章

---

### 6. GitHub OAuth 认证

保护你的 CMS 编辑器：

**配置步骤**:
1. 阅读 `GITHUB_OAUTH_SETUP.md` 文档
2. 在 GitHub 创建 OAuth App
3. 配置 `.env` 文件
4. 重启开发服务器

**配置完成后**:
- 访问 `/keystatic` 会要求 GitHub 登录
- 只有授权用户可以编辑内容

---

## 📝 创建示例文章

创建一个新文章来测试所有功能：

```bash
# 在 src/content/posts/ 创建新文件
# 例如: example-features.mdoc
```

**文章内容示例**:

```markdown
---
title: 功能测试文章
published: 2026-01-05
description: 测试所有新功能
---

# 欢迎使用新功能

## 测试 Callouts

:::note
这是一个提示框测试
:::

:::warning
请注意这个警告
:::

## 测试数学公式

质能方程: $E = mc^2$

二次方程求根公式:
$$
x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}
$$

## 测试按钮

这些按钮可以在 HTML 中使用：
- btn-gradient-primary
- btn-gradient-success
- btn-gradient-warning

## 测试搜索

这篇文章会被 Pagefind 索引，可以通过搜索找到。
```

---

## 🖥️ 快速访问链接

开发服务器启动后，访问以下页面：

- **首页**: http://localhost:4321/
- **功能展示**: http://localhost:4321/features-demo
- **搜索页面**: http://localhost:4321/search
- **文章列表**: http://localhost:4321/posts
- **CMS 管理**: http://localhost:4321/keystatic

---

## 🎨 自定义样式

### 修改主题色

编辑 `src/styles/mizuki-enhancements.css`:

```css
.mizuki-theme {
  --mizuki-hue: 210;  /* 修改这个值改变主题色 */
  /* 0-360 的任何值:
     0 = 红色
     120 = 绿色
     210 = 蓝色
     280 = 紫色
  */
}
```

### 修改按钮样式

编辑 `src/styles/gradient-buttons.css`:

```css
.btn-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* 修改渐变颜色 */
}
```

---

## 🐛 常见问题

### Q: 渐变按钮没有显示？
**A**: 确保页面引入了 `mizuki-enhancements.css`。检查 `Layout.astro` 是否有：
```astro
import '@styles/mizuki-enhancements.css'
```

### Q: Callouts 没有样式？
**A**: 确保引入了 `markdown-callouts.css`：
```astro
import '@styles/markdown-callouts.css'
```

### Q: 数学公式不显示？
**A**: 确保引入了 KaTeX CSS：
```astro
import 'katex/dist/katex.min.css'
```

### Q: 搜索功能 404？
**A**: 搜索功能需要构建后才能使用索引。运行：
```bash
pnpm build
pnpm preview
```

---

## 📚 相关文档

- `MIGRATION_SUMMARY.md` - 完整迁移总结
- `EDGEONE_DEPLOYMENT.md` - EdgeOne 部署指南
- `GITHUB_OAUTH_SETUP.md` - GitHub OAuth 配置

---

## 🎉 开始使用

1. 访问 http://localhost:4321/features-demo 查看所有功能
2. 创建一篇新文章测试 Markdown 功能
3. 点击导航栏的搜索图标测试搜索
4. 使用渐变按钮美化你的页面

享受你的新博客功能吧！✨
