#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parseDocument, stringify } from 'yaml';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const templatesDirectory = fileURLToPath(new URL('../templates/posts/', import.meta.url));
export const templates = ['post', 'note', 'reading', 'paper', 'weekly', 'bookmark'];
const categories = ['Technology', 'Programming', 'Web Development', 'Tutorial', 'Design', 'Research', 'Personal', 'Other'];

export function shanghaiDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

function validateSlug(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) {
    throw new Error('slug 请使用小写英文字母、数字和连字符，例如 reading-2026-10；它决定文章网址。');
  }
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

function postFiles(root) {
  const directory = path.join(root, 'src/content/posts');
  return fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && !entry.name.startsWith('_') && /\.(mdoc|md)$/.test(entry.name))
    .map(entry => path.join(directory, entry.name)).sort();
}

function postId(file) {
  return path.basename(file, path.extname(file)).toLowerCase();
}

export function readPost(file) {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path.basename(file)} 缺少 YAML frontmatter（文件开头的 --- 区块）。`);
  const document = parseDocument(match[1]);
  if (document.errors.length) throw new Error(`${path.basename(file)} YAML 无法解析：${document.errors[0].message}`);
  const data = document.toJS({ maxAliasCount: 100 });
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('文章 frontmatter 必须是键值对象。');
  return { file, id: postId(file), document, data, body: source.slice(match[0].length) };
}

export function inspectPost(post, { ready = false } = {}) {
  const errors = [];
  const warnings = [];
  const { data, body } = post;
  if (typeof data.title !== 'string' || !data.title.trim()) errors.push('title 必须是非空字符串');
  if (data.draft !== undefined && typeof data.draft !== 'boolean') errors.push('draft 必须是 true 或 false，不能加引号');
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string'))) errors.push('tags 必须是字符串数组');
  for (const key of ['excerpt', 'category', 'featuredImage', 'imgAlt', 'imageAlt']) {
    if (data[key] !== undefined && typeof data[key] !== 'string') errors.push(`${key} 必须是字符串`);
  }
  if (data.publishedDate !== undefined && !validDate(data.publishedDate)) errors.push('publishedDate 必须是有效的 YYYY-MM-DD 日期');
  if (typeof data.category === 'string' && !categories.includes(data.category)) warnings.push('category 不在 CMS 预设分类中，网站可展示，但 CMS 编辑时需要留意');

  const readiness = [];
  if (!data.publishedDate) readiness.push('还没有发布日期');
  const text = body.replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*#{1,6}\s+.*$/gm, '').trim();
  if (!text) readiness.push('还没有正文内容');
  if (/<!--\s*TODO\b/i.test(body)) readiness.push('还有模板中的 TODO 提示，请补完内容并删除提示');
  (ready ? errors : warnings).push(...readiness);
  return { errors, warnings };
}

export function createPost(root, slug, { title, template = 'post', date = shanghaiDate() } = {}) {
  validateSlug(slug);
  if (!templates.includes(template)) throw new Error(`未知模板：${template}。可选：${templates.join(', ')}`);
  if (typeof title !== 'string' || !title.trim()) throw new Error('请用 --title 提供文章标题，支持中文。');
  if (!validDate(date)) throw new Error('--date 必须是有效的 YYYY-MM-DD 日期。');
  const directory = path.join(root, 'src/content/posts');
  // Astro normalizes IDs; also reject collisions across supported formats and case.
  const collision = fs.readdirSync(directory).find(name =>
    path.basename(name, path.extname(name)).toLowerCase() === slug);
  if (collision) throw new Error(`已存在同名文章 ${collision}，不会覆盖。`);
  const data = {
    title: title.trim(),
    publishedDate: date,
    excerpt: '',
    tags: [],
    category: template === 'paper' ? 'Research' : ['note', 'weekly'].includes(template) ? 'Personal' : 'Other',
    draft: true,
  };
  const body = fs.readFileSync(path.join(templatesDirectory, `${template}.md`), 'utf8');
  const file = path.join(directory, `${slug}.mdoc`);
  fs.writeFileSync(file, `---\n${stringify(data)}---\n\n${body}`, { flag: 'wx' });
  return file;
}

export function findPost(root, slug) {
  validateSlug(slug);
  const matches = postFiles(root).filter(file => postId(file) === slug);
  if (matches.length !== 1) throw new Error(matches.length ? `文章 ID 重复：${slug}` : `找不到文章：${slug}`);
  return readPost(matches[0]);
}

export function markPublished(root, slug) {
  const post = findPost(root, slug);
  const result = inspectPost(post, { ready: true });
  if (result.errors.length) throw new Error(`发布检查未通过：\n- ${result.errors.join('\n- ')}`);
  post.document.set('draft', false);
  // Preserve the article body byte-for-byte; YAML's document API retains comments.
  fs.writeFileSync(post.file, `---\n${post.document.toString()}---\n${post.body}`);
  return post.file;
}

const help = `文章工具（所有修改都只保存在本地，提交和推送由 Git 完成）

pnpm post:new <slug> --title "中文标题" [--template post|note|reading|paper|weekly|bookmark] [--date YYYY-MM-DD]
pnpm post:list
pnpm post:check [slug] [--ready]
pnpm post:publish <slug>

new：新建 .mdoc 草稿，不覆盖已有文章；默认日期采用北京时间。
list：列出仓库内 .mdoc/.md 文章及草稿状态。
check：检查 YAML、字段和日期；--ready 还要求正文、日期和模板填写完成。
publish：通过检查后把单篇文章标记为 draft: false，不提交、不推送。

公开仓库里的草稿原稿也可被读取。合并到 main 后，由已连接的部署平台发布网站。`;

export function main(argv = process.argv.slice(2), root = projectRoot) {
  const [command, ...args] = argv;
  if (!command || command === '--help' || command === '-h') { console.log(help); return; }
  const options = command === 'new'
    ? { title: { type: 'string' }, template: { type: 'string' }, date: { type: 'string' } }
    : command === 'check' ? { ready: { type: 'boolean' } } : {};
  const { values, positionals } = parseArgs({
    args, allowPositionals: true, options: { ...options, help: { type: 'boolean', short: 'h' } },
  });
  if (values.help) { console.log(help); return; }
  if (!['new', 'list', 'check', 'publish'].includes(command)) throw new Error(`未知命令：${command}`);
  if (positionals.length > (command === 'list' ? 0 : 1)) throw new Error('参数过多；标题请放在 --title 后并加引号。');
  const [slug] = positionals;
  if (command === 'new') {
    const file = createPost(root, slug, values);
    console.log(`已创建草稿：${path.relative(root, file)}\n下一步：补完正文，然后 pnpm post:check ${slug} --ready`);
    return;
  }
  if (command === 'publish') {
    const file = markPublished(root, slug);
    console.log(`本地已标记为可发布：${path.relative(root, file)}\n请构建检查、提交并推送；合并到 main 后再确认部署成功。`);
    return;
  }
  const files = slug ? [findPost(root, slug).file] : postFiles(root);
  let failures = 0;
  let warnings = 0;
  const ids = new Set();
  for (const file of files) {
    try {
      const post = readPost(file);
      if (ids.has(post.id)) throw new Error(`文章 ID 重复：${post.id}`);
      ids.add(post.id);
      if (command === 'list') {
        console.log(`${post.data.draft === true ? '草稿' : '非草稿'}\t${post.data.publishedDate || '未定日期'}\t${post.id}\t${post.data.title}`);
      } else {
        const result = inspectPost(post, { ready: values.ready === true });
        failures += result.errors.length;
        warnings += result.warnings.length;
        for (const error of result.errors) console.error(`错误 ${post.id}：${error}`);
        for (const warning of result.warnings) console.log(`提示 ${post.id}：${warning}`);
      }
    } catch (error) {
      failures++;
      console.error(error.message);
    }
  }
  if (command === 'check') console.log(`已检查 ${files.length} 篇文章：${failures} 个错误，${warnings} 个提示。`);
  if (failures) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
