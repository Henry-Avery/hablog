# 📝 Keystatic 编辑器功能指南

## 🎯 核心功能

### 1. 富文本编辑器 (Markdoc)
Keystatic 使用 **Markdoc** 作为核心编辑器，支持：

#### ✅ 已支持的功能
- **标题** - `# H1`, `## H2`, `### H3` 等
- **段落** - 普通文本段落
- **粗体/斜体** - `**粗体**`, `*斜体*`
- **列表** - 有序列表和无序列表
- **链接** - `[文本](URL)`
- **引用** - `> 引用文本`
- **代码块** - 支持语法高亮
  ```javascript
  const hello = "world";
  ```
- **行内代码** - `\`code\``
- **水平线** - `---`

### 2. 图片管理 📷

#### 特色图片
- 上传位置：`src/assets/images/posts/[slug]/`
- 自动优化：Astro 自动处理图片优化
- 必填字段：Alt 文本（无障碍访问）

#### 文章内图片
- 直接在编辑器中插入
- 拖拽上传
- 自动保存到文章目录
- 路径：`@assets/images/posts/`

### 3. 数学公式支持 🧮

你的博客已经配置了 **KaTeX** 支持！在 Markdoc 中使用：

**行内公式：**
```markdown
This is an inline formula: $E = mc^2$
```

**块级公式：**
```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**配置位置：** `astro.config.mjs:28-30`
- `remark-math` - 解析数学语法
- `rehype-katex` - 渲染 KaTeX 公式

### 4. 新增字段说明

#### 📂 分类 (Categories)
- 多选下拉框
- 预设分类：
  - Technology
  - Programming
  - Web Development
  - Tutorial
  - Design
  - Other
- 可选择多个分类

#### 🏷️ 标签 (Tags)
- 动态数组字段
- 可以添加任意数量的自定义标签
- 点击 "Add Tag" 添加新标签

#### 📝 草稿状态 (Draft)
- 复选框
- 勾选后文章保存为草稿
- 草稿不会在网站上显示
- 便于编辑中的内容管理

#### ✍️ 作者 (Author)
- 文本字段
- 默认值：'Astrokeys'
- 支持多作者博客

### 5. 代码块增强 💻

Markdoc 编辑器支持代码高亮：

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

支持的语言：JavaScript, TypeScript, Python, Java, C++, Go, Rust, HTML, CSS 等

### 6. Admonitions (警告框) ⚠️

你的博客支持 GitHub 风格的警告框：

```markdown
> [!NOTE]
> 这是一个提示信息

> [!WARNING]
> 这是一个警告信息

> [!TIP]
> 这是一个技巧提示

> [!IMPORTANT]
> 这是重要信息

> [!CAUTION]
> 这是需要注意的信息
```

**配置位置：** `astro.config.mjs:24-25`

## 🔧 编辑器使用技巧

### 快捷键
- `Ctrl/Cmd + B` - 粗体
- `Ctrl/Cmd + I` - 斜体
- `Ctrl/Cmd + K` - 插入链接
- `Ctrl/Cmd + Shift + C` - 代码块

### 图片优化建议
1. 使用 WebP 或现代图片格式
2. 上传前压缩图片（推荐 < 500KB）
3. 使用描述性的 Alt 文本
4. 特色图片推荐尺寸：1200x630px

### 写作最佳实践
1. **使用语义化标题** - 按层级使用 H1-H6
2. **添加摘要** - 简洁的文章概述（100-160 字符）
3. **选择合适的分类和标签** - 便于读者查找
4. **使用草稿功能** - 未完成的文章先保存为草稿
5. **添加 Alt 文本** - 提升无障碍访问和 SEO

## 📊 内容管理结构

### Collections (集合)
- **Posts** - 博客文章
- **Spec** - 特殊页面/规范

### Singletons (单例)
- **Home** - 首页配置
- **Navbar** - 导航栏设置
- **Footer** - 页脚设置
- **Branding** - 品牌设置
- **SEO** - SEO 配置

## 🚀 高级功能

### 自定义 Markdoc 标签
你可以扩展 Markdoc 添加自定义组件：

```typescript
// 示例：添加自定义标签
import { Tag } from '@markdoc/markdoc';

export const callout = {
  render: 'Callout',
  attributes: {
    type: { type: String }
  }
};
```

### GitHub 集成
配置 GitHub OAuth 后可以：
- 直接在线编辑
- 自动创建 commit
- 创建 Pull Request
- 查看编辑历史

## 💡 功能对比

| 功能 | Keystatic | 传统 Markdown |
|------|-----------|---------------|
| 可视化编辑 | ✅ | ❌ |
| 图片上传 | ✅ 拖拽上传 | ❌ 手动处理 |
| 实时预览 | ✅ | 部分 |
| 字段验证 | ✅ | ❌ |
| 媒体管理 | ✅ | ❌ |
| 多用户协作 | ✅ (GitHub 模式) | ❌ |
| 版本控制 | ✅ Git | ✅ Git |

## 📚 相关资源

- [Keystatic 官方文档](https://keystatic.com/docs)
- [Markdoc 文档](https://markdoc.dev/)
- [KaTeX 数学公式](https://katex.org/docs/supported.html)
- [GitHub Admonitions](https://github.com/community/community/discussions/16925)

## 🎨 未来扩展建议

1. **SEO 预览** - 在编辑时预览搜索结果显示
2. **阅读时间估算** - 自动计算文章阅读时间
3. **相关文章推荐** - 基于标签的相关内容
4. **评论系统集成** - Giscus 或 Disqus
5. **社交媒体预览** - Open Graph 图片生成
