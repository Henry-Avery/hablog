# 用 Codex 写博客和维护日常记录

`hablog` 的文章和图片都来自 GitHub 仓库。你可以在对话中给 Codex 文字、Markdown 和图片，让它编辑仓库、检查、提交。Keystatic 是另一个编辑入口；直接修改仓库不需要操作它的后台或创建额外 GitHub 凭据。

## 直接对 Codex 这样说

| 想做什么 | 可以怎么说 |
| --- | --- |
| 随手记 | “把下面这段想法整理成一篇随手记，先保存草稿。” |
| 上传文章 | “把这份 Markdown 和图片放进博客，保留正文，准备一个预览。” |
| 改旧文章 | “更新这篇文章的第二节，保留网址和原来的发布日期。” |
| 读书笔记 | “根据这些摘录和我的想法整理读书笔记，引用标出处。” |
| 论文笔记 | “根据这篇论文和我的批注，整理问题、方法、证据和局限。” |
| 周复盘 | “只用我给的这些记录整理本周复盘，列出下周最重要的一件事。” |
| 工具收藏 | “把这些链接整理成工具收藏，记下用途和我提供的使用体验。” |
| 藏书馆 | “把藏书馆里《书名》改成已读，并加上这段读后感。” |
| 发布 | “把这篇已确认的文章发布到博客，检查上线结果。” |

前几项都可以通过文件和 Git 完成。论文总结需要原文证据，个人复盘需要真实记录；Codex 不应补造经历或结论。没有提供的事实应留待补充。

## 新建文章

安装依赖后，在仓库根目录运行：

```bash
pnpm post:new my-first-note --title "今天想记住的一件事" --template note
```

会生成 `src/content/posts/my-first-note.mdoc`，网址对应 `/posts/my-first-note`。标题可以中文；slug 使用小写英文字母、数字和连字符。已有同名文章时命令会停止，不覆盖旧内容。默认日期采用北京时间，也可以显式指定 `--date YYYY-MM-DD`。

| 模板 | 用途 |
| --- | --- |
| `post` | 普通文章：问题、过程、结论 |
| `note` | 随手记：一个发现和自己的想法 |
| `reading` | 读书笔记：观点、理解、实践 |
| `paper` | 论文笔记：问题、证据、局限、工作关联 |
| `weekly` | 周复盘：进展、卡点、发现、下一步 |
| `bookmark` | 工具和链接收藏：来源、用途、使用记录 |

模板包含 TODO 提示。填写正文后删除这些提示，再进行发布检查。

## 上传已有 Markdown 和图片

把 `.md` 原稿放到 `src/content/posts/<slug>.md`。现有 `.mdoc` 使用 Markdoc，普通 `.md` 使用 Markdown；带有特殊语法时先预览，避免直接改扩展名。

文件开头需要 YAML frontmatter：

```yaml
---
title: 我的文章标题
publishedDate: 2026-10-15
excerpt: 一句话说明这篇文章讲什么
tags:
  - 日常
category: Personal
draft: true
---
```

字段名沿用当前博客，使用 `publishedDate`、`excerpt`，不要换成其他主题常见的 `published`、`description`。新文章建议始终明确写出 `draft`。

正文插图最直接的做法是放进 `public/images/posts/<slug>/`，正文使用：

```markdown
![图片说明](/images/posts/my-first-note/example.png)
```

封面可以放在 `src/assets/images/posts/<slug>/cover.jpg`，frontmatter 使用：

```yaml
featuredImage: ../../assets/images/posts/my-first-note/cover.jpg
imgAlt: 封面图片说明
```

原稿和图片一起提交、推送。云环境临时下载地址、本机绝对路径不能作为博客图片地址。

也可以直接在 GitHub 网页上传：先切到工作分支，在 `src/content/posts/` 点击 **Add file → Upload files** 上传带 frontmatter 的 `.md`，再把图片上传到对应的 `public/images/posts/<slug>/` 目录。提交后创建 PR，查看自动检查和 Vercel 预览。合并 `main` 会触发生产部署，所以保存草稿时保留 `draft: true`。通过 Codex 操作时，这些文件整理和 Git 步骤可以直接交给它完成。

## 检查、预览和发布

```bash
# 找到文章与草稿
pnpm post:list

# 检查整个仓库内平铺的 .mdoc/.md 文章格式
pnpm post:check

# 检查单篇是否已补齐发布日期、正文和模板
pnpm post:check my-first-note --ready

# 只在明确准备发布这篇文章时执行
pnpm post:publish my-first-note

pnpm test
pnpm build
```

普通检查会把缺少正文或日期作为提示，以兼容历史文章；`--ready` 和 `post:publish` 会将这些问题视为阻止发布的错误。构建负责进一步检查 Astro 内容、封面路径和页面生成。工具不会核实事实、保证所有外部链接可用，也不会判断文章质量。

这些命令不会自动提交、推送或合并。`post:list` 的“非草稿”只表示文件内不是 `draft: true`，不代表网站已经更新。

1. 在工作分支编辑并完成检查。
2. 选择文章和图片文件提交，推送到 GitHub，创建或更新 PR。
3. 检查 PR 的 CI 和 Vercel 预览。生产模式的预览会隐藏草稿；需要分享文章预览时，可以在工作分支将它标记为非草稿。
4. 按用户的发布指令合并到 `main`。已连接的 Vercel 会触发生产部署。
5. 确认生产部署成功，再访问最终文章地址确认结果。

如果希望本地查看草稿，可使用 `pnpm dev`。开发服务器不生成生产搜索索引；搜索以完整构建和部署结果为准。未来日期只是文章元数据，当前没有定时发布功能。

## 藏书馆与后续日常功能

现有 `/library` 是仓库数据驱动的藏书馆，支持搜索和分类。书目、阅读状态和读后感位于 `src/components/library/booksData.ts`，修改后随正常提交和部署发布。`status` 使用 `toread`（想读）、`reading`（在读）、`completed`（已读）。保留原有书籍 ID 和其他条目。

读书笔记模板可以先把完整想法写成文章；书目状态和简短感想则保存在藏书馆数据中。工具收藏目前通过 `bookmark` 模板保存为文章，可配上“工具收藏”等标签筛选。独立收藏页面、随机重读推荐、自动汇总周报属于后续可选功能，目前没有定时任务或自动后台采集。

## 保存与隐私

这个仓库是公开的：即使 `draft: true`，原稿也会在 GitHub 源码里公开。未决定公开的笔记先留在私有资料仓库。页面没有显示不等于原稿私密。

保存是否完成，以 GitHub 上存在对应提交为准。云环境文件、未推送提交和 `.gitignore` 忽略的文件不会自动变成外部备份。每次结束时检查 `git status` 和推送结果。
