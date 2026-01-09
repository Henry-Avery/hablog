# 📚 藏书馆集成指南 (Astro)

这是一个基于 React + Tailwind CSS + Recharts 构建的藏书馆展示页面，旨在集成到你的 Astro 博客中。

## 1. 安装必要依赖

在你的 Astro 项目根目录下运行以下命令，安装 React 支持、图标库和图表库：

```bash
# 1. 安装 Astro React 集成 (如果尚未安装)
npx astro add react tailwind

# 2. 安装组件依赖
npm install lucide-react recharts
# 或者
pnpm add lucide-react recharts
# 或者
yarn add lucide-react recharts
```

## 2. 文件结构检查

请确保你已将生成的文件放置在正确的目录结构中：

```text
src/
├── components/
│   └── library/           <-- 建议新建此文件夹
│       ├── BookCard.tsx   <-- 书籍卡片组件
│       ├── LibraryBoard.tsx <-- 主面板组件 (原 App.tsx 重构)
│       ├── Stats.tsx      <-- 统计图表组件
│       ├── booksData.ts   <-- 书籍数据源
│       └── types.ts       <-- TypeScript 类型定义
└── pages/
    └── library.astro      <-- 页面入口文件
```

## 3. 配置导航栏 (Navbar)

为了让访客能点击进入藏书馆，你需要修改项目的导航配置。通常位于 `src/settings/navbar.json` 或 `src/config.ts` 中。

**修改示例 (`src/settings/navbar.json`):**

找到原本的 "Dropdown Menu" 相关的配置，将其替换为：

```json
{
  "text": "藏书馆",
  "isDropdown": {
    "discriminant": false,
    "value": {
      "link": "/library"
    }
  }
}
```

## 4. 常见问题排查

### Q1: 页面显示 `ReferenceError: document is not defined`
**原因**: React 组件中有直接操作 DOM 的代码，但在服务端渲染(SSR)时执行了。
**解决**: 确保在 `src/pages/library.astro` 中引用组件时加上了 `client:load` 或 `client:only="react"` 指令。
```astro
<LibraryBoard client:load />
```

### Q2: 样式没有生效 (Tailwind)
**原因**: Astro 的 Tailwind 集成可能没有扫描到新添加的文件夹。
**解决**: 检查 `tailwind.config.mjs` (或 .js) 文件，确保 `content` 数组包含了组件目录：
```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  // ...
}
```

### Q3: `Layout` 导入错误
**原因**: `src/pages/library.astro` 中默认假设你的布局文件在 `../layouts/Layout.astro`。
**解决**: 请根据你实际的博客主题结构，修改 `library.astro` 顶部的 import 路径。例如可能是 `import BaseLayout from '../layouts/BaseLayout.astro';`。

## 5. 如何添加新书？

直接编辑 `src/components/library/booksData.ts` 文件，在数组中添加新的对象即可。

```typescript
{
  "id": "new-book-id",
  "title": "新书标题",
  "author": "作者",
  "category": "分类", // 小说, 科技, 历史, 经管, 哲学, 心理, 传记, 其他
  "summary": "简介...",
  "tags": ["标签1", "标签2"],
  "isEnriched": true,
  "status": "reading", // reading (在读), completed (已读), toread (想读)
  "notes": "读后感...",
  "year": "2024"
},
```
