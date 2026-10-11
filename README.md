# Henry 的博客 · hablog

[博客](https://henryavery.cn) · [Vercel 地址](https://hablog.vercel.app)

使用 Astro 5、Keystatic、React/Svelte、Tailwind CSS 和 Pagefind。文章保存在 GitHub 中，Vercel 负责提供服务。私有笔记和未公开资料放在独立的 `Henry-Avery/cloud-workspace` 仓库。

## 云端或本地启动

使用 Node.js 22（见 `.nvmrc`）和 pnpm 10.22.0（见 `packageManager`）。已有 Node.js 24 也在声明的支持范围内。

```bash
gh repo clone Henry-Avery/hablog
cd hablog
corepack pnpm@10.22.0 install --frozen-lockfile
corepack pnpm@10.22.0 dev --host 0.0.0.0
```

普通预览和文件编辑不需要填写 CMS 密钥。需要通过 `/keystatic` 编辑时，参照 [Keystatic 配置](KEYSTATIC_SETUP.md) 和 [GitHub App 配置](GITHUB_OAUTH_SETUP.md)，从 `.env.example` 创建本地 `.env`。生产密钥在部署平台配置。

## 内容与目录

| 目录 | 用途 |
| --- | --- |
| `src/content/posts/` | 文章，现有内容主要为 `.mdoc` |
| `src/assets/images/posts/` | 文章图片，随文章一起提交 |
| `src/content/pages/`、`src/settings/` | 首页内容与站点配置 |
| `src/components/`、`src/layouts/` | 组件与布局 |
| `scripts/`、`tests/` | 图片检查与回归测试 |

文章使用 `title`、`publishedDate`、`excerpt`、`tags`、`category`、`draft` 等字段。开发模式可预览草稿；生产文章页、列表、归档、标签、分类、日历、统计和 Pagefind 索引排除 `draft: true` 的文章。

**本仓库公开。** 草稿标记只控制网站展示，原始文件仍会公开出现在 GitHub 上。尚未决定公开的草稿请存到私有资料仓库。

## 检查与构建

```bash
corepack pnpm@10.22.0 test
corepack pnpm@10.22.0 run check:images
corepack pnpm@10.22.0 build
```

- `build` 先执行 Astro 构建，再对 `.vercel/output/static` 生成 `_pagefind` 搜索索引。
- `dev` 和 `build` 不删除源图片。`check:images` 仅报告待复查目录；旧命令 `clean:images` 也只做检查。详情见 [图片检查说明](IMAGE_CLEANUP_SYSTEM.md)。
- 当前使用 Vercel 服务端适配器；生产预览应使用 Vercel 的预览部署。`astro preview` 不支持这个适配器的完整服务端运行，开发服务器也不会生成生产搜索索引。
- Pull Request 和 `main` 推送会自动执行测试、图片检查和构建，并检查构建是否修改已跟踪文件。

## 协作与保存

```bash
git status
git pull --ff-only
git switch -c work/文章或功能名
# 编辑后，选择实际修改的文件
git add src/content/posts/文章名.mdoc src/assets/images/posts/文章名/
git diff --cached
git commit -m "docs: update post"
git push -u origin HEAD
gh pr create
```

只有成功推送的提交才有 GitHub 副本。更换云环境时重新克隆即可恢复。同步私有资料仓库时要分别提交、分别推送，不能通过博客仓库保存旁边目录的资料。

[功能使用指南](QUICK_START.md) · [Vercel 部署](VERCEL_DEPLOYMENT.md) · [CMS 配置](KEYSTATIC_SETUP.md)
