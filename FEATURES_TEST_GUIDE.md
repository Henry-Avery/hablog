# 新功能测试指南

## 已实现的功能

### 1. 搜索功能 (Pagefind)

**位置**: 导航栏右侧搜索图标

**测试步骤**:
- **开发环境** (`pnpm dev`):
  - 点击搜索按钮
  - 输入任意文本
  - 应该显示两条 mock 数据提示你需要 build 才能使用真实搜索

- **生产环境** (测试真实搜索):
  ```bash
  pnpm build
  pnpm preview
  ```
  - 访问 http://localhost:4321
  - 点击搜索按钮
  - 输入文章关键词（如 "Astro", "Keystatic"）
  - 应该显示真实的搜索结果
  - 点击结果可跳转到对应文章

**文件位置**:
- `src/components/Search.svelte` - 搜索组件
- `src/utils/panel-manager.ts` - 浮动面板管理器
- `src/components/Navbar.astro` - 集成搜索按钮和 Pagefind 加载脚本

---

### 2. 增强版目录 (TOC)

**位置**: 文章详情页右侧（桌面端）

**测试步骤**:
1. 访问任意文章（如 `/posts/what-is-astro`）
2. 在右侧应该看到 "Table of Contents" 卡片
3. 显示文章所有标题（h1-h6）
4. 滚动文章时，目录会自动高亮当前可见的章节
5. 点击目录项会平滑滚动到对应位置
6. 移动端会隐藏目录

**特性**:
- ✅ 自动高亮当前章节
- ✅ 平滑滚动导航
- ✅ Intersection Observer 跟踪可见性
- ✅ 响应式设计（桌面显示，移动隐藏）
- ✅ 自动生成标题层级（带数字/点标记）

**文件位置**:
- `src/components/widget/TOC.astro` - TOC 组件（Web Component）
- `src/pages/posts/[slug].astro` - 文章页面集成

---

### 3. 网站统计组件

**位置**: 首页 Hero 区域下方

**测试步骤**:
1. 访问首页 `/`
2. Hero 下方应该看到统计卡片
3. 显示以下信息:
   - 📝 **Articles**: 文章总数
   - 📊 **Total Words**: 总字数（格式化，带千位分隔符）
   - 📅 **Running Days**: 网站运行天数（动态计算）
   - 💓 **Last Update**: 距离最后一篇文章的天数

**动态更新**:
- 运行天数和最后更新时间会在客户端动态计算
- 每小时自动更新一次

**自定义**:
- 在 `src/components/widget/SiteStats.astro` 的第 11 行修改网站开始日期:
  ```typescript
  const siteStartDate = "2026-01-01"; // 修改为你的实际日期
  ```

**文件位置**:
- `src/components/widget/SiteStats.astro` - 统计组件
- `src/pages/index.astro` - 首页集成

---

## 配置文件

### Pagefind 配置
`pagefind.yml` - 控制搜索索引行为
- 排除导航栏、页脚、KaTeX 公式
- 语言设置为英文
- 摘要长度等配置

### Build 脚本
`package.json` - 添加了 Pagefind 到 build 流程:
```json
"build": "astro build && pagefind --site dist"
```

### Astro 配置
`astro.config.mjs` - 添加了 Svelte 集成:
```javascript
integrations: [
  react(),
  svelte(),  // 新增
  markdoc({ allowHTML: true }),
  keystatic()
]
```

---

## 技术栈

- **Svelte 5.46.1** - 用于 Search 组件
- **Pagefind 1.4.0** - 静态全文搜索
- **Web Components** - TOC 使用自定义元素
- **DaisyUI** - UI 组件库（stats, card, btn 等）
- **Intersection Observer API** - TOC 可见性跟踪

---

## 已知问题和限制

1. **搜索功能**:
   - 开发环境下只显示 mock 数据
   - 必须运行 `pnpm build` 生成索引后才能使用真实搜索
   - 搜索索引只包含 `data-pagefind-body` 标记的内容

2. **TOC**:
   - 只在文章页面 (`/posts/*`) 显示
   - 需要文章有至少一个标题才会显示
   - 移动端隐藏（可以后续添加移动版 TOC）

3. **网站统计**:
   - 网站开始日期需要手动配置
   - 字数统计基于 markdown 源文件，不是渲染后的 HTML

---

## 下一步可选功能

未实现但可以添加的功能（Mizuki 项目中有完整实现）:

1. **文章归档时间轴** - 按年份分组的文章列表（Svelte 组件）
2. **项目展示卡片** - 展示你的项目（带状态、技术栈、链接）
3. **时间轴组件** - About 页面的教育/工作经历
4. **日历组件** - 显示每天文章数量的月历视图

如需添加这些功能，可以从 `mizuki/` 目录复制对应组件并适配。

---

## 测试清单

- [ ] 开发环境正常启动 (`pnpm dev`)
- [ ] 搜索按钮可点击，显示 mock 数据
- [ ] 文章详情页显示 TOC
- [ ] TOC 可点击跳转，自动高亮
- [ ] 首页显示网站统计
- [ ] 运行 `pnpm build` 成功
- [ ] 运行 `pnpm preview` 预览生产版本
- [ ] 生产环境搜索功能正常
- [ ] 样式正常，无报错

---

## 故障排除

### 问题: 搜索不工作
- 确保运行了 `pnpm build`
- 检查 `dist/_pagefind/` 目录是否存在
- 查看浏览器控制台是否有 Pagefind 加载错误

### 问题: TOC 不显示
- 确保文章有标题（h1-h6）
- 检查浏览器宽度是否大于 lg（1024px）
- 查看控制台是否有 JavaScript 错误

### 问题: 统计数据不准确
- 检查是否所有文章都有 `publishedDate` 字段
- 确认网站开始日期设置正确

---

## 参考

- **Mizuki 项目**: `/Users/Henry/Desktop/astrokeys/mizuki/`
- **Pagefind 文档**: https://pagefind.app/
- **DaisyUI 文档**: https://daisyui.com/
- **Astro 文档**: https://docs.astro.build/
