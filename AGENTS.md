# Working on hablog

## Project and commands

- This is Henry's public Astro 5 blog, using Keystatic, Tailwind CSS, React/Svelte, Pagefind, and the Vercel server adapter.
- Use Node.js 22 and pnpm 10.22.0. `corepack pnpm@10.22.0` works without changing the global package manager.
- Install with `pnpm install --frozen-lockfile`. Run `pnpm test`, `pnpm post:check`, and `pnpm build` for relevant code/content changes. Build generates `.vercel/output/static/_pagefind`.
- Start development with `pnpm dev --host 0.0.0.0`. The Vercel adapter does not provide a complete production server through `astro preview`; use the PR's Vercel preview deployment.

## Content map

| User request | Files |
| --- | --- |
| Write or edit a post | `src/content/posts/<slug>.mdoc` or `.md` |
| Post cover / Keystatic images | `src/assets/images/posts/<slug>/` |
| Uploaded Markdown body images with public URLs | `public/images/posts/<slug>/` |
| Home copy | `src/content/pages/home.json` |
| Navigation / branding / SEO | `src/settings/` |
| About page content | `src/pages/about.astro` (currently hard-coded; `src/content/spec/about.mdoc` is not rendered here) |
| Books, reading status, reading notes | `src/components/library/booksData.ts` |
| Project cards | `src/data/projects.ts` (imported by `src/pages/projects.astro`) |
| Timeline | `src/data/timeline.ts` |

Read the relevant page/component before editing data: some pages still contain template examples. Do not replace them with invented facts about Henry.

## Writing workflow

1. Inspect `git status`, fetch origin, and account for recent remote changes. Preserve concurrent user edits and existing article URLs.
2. Read [docs/WRITING.md](docs/WRITING.md). Create new articles with `pnpm post:new <slug> --title "..." --template <post|note|reading|paper|weekly|bookmark>`; new files are drafts. Use `pnpm post:list` to locate existing articles.
3. Match the user's wording and intent. Preserve provided facts, references, dates, and personal experience. Do not invent reading progress, experimental results, citations, or life events. Templates are outlines, not content to publish unchanged.
4. For uploaded Markdown, preserve `.md` if it uses Markdown-specific syntax; do not silently convert to Markdoc. Copy attachments into the repository and use correct repository/public paths. Never embed temporary workspace or attachment download links in published posts.
5. A request to draft, organize, or edit does not imply publication. A clear request to publish supplies publication authorization; do not ask for the same permission again. Before changing `draft` to `false`, run `pnpm post:check <slug> --ready` (also enforced by `pnpm post:publish <slug>`), then verify the full build.
6. Commit only the intended files, push, and use a PR for review. Merge and production release must fit the user's requested scope. Check CI and deployment status before reporting that a post is live; a local commit or a pushed feature branch alone is not a production release.
7. Report the saved file, branch/PR, verification result, and whether the article is a draft, a preview, or live.

## Data preservation

- This repository is public. `draft: true` hides a post from the production website but not from GitHub source or history. Keep private source material in a separate private workspace until the user intends to make it public.
- GitHub is the external copy only after a successful push. Temporary cloud files and ignored files have no GitHub backup.
- Do not delete source images during dev/build. `pnpm run check:images` is read-only and reports candidates for manual review.
- Do not commit `.env*` secrets, tokens, generated build output, or dependency directories. `.env.example` contains placeholders only.
- Use one shared visibility policy (`src/utils/content-utils.ts` / `post-policy.mjs`) for posts, archive, navigation, and statistics so production drafts stay excluded.
