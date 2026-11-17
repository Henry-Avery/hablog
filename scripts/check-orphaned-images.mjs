#!/usr/bin/env node

// Report image folders for manual review. Never delete or move source files.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const postExtensions = new Set(['.md', '.mdx', '.mdoc', '.yaml', '.json']);
const textExtensions = new Set([
  ...postExtensions, '.yml', '.astro', '.svelte', '.ts', '.tsx', '.js', '.jsx',
  '.mjs', '.css', '.styl', '.html', '.svg',
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const location = path.join(directory, entry.name);
    // Do not follow symlinks outside the source tree.
    if (entry.isDirectory()) return walk(location);
    return entry.isFile() ? [location] : [];
  });
}

export function inspectImageFolders(root) {
  const postsDirectory = path.join(root, 'src/content/posts');
  const imagesDirectory = path.join(root, 'src/assets/images/posts');
  if (!fs.existsSync(postsDirectory)) {
    throw new Error('文章目录不存在，无法判断图片用途；请先恢复文章文件。');
  }

  const postFolders = new Set();
  for (const file of walk(postsDirectory)) {
    if (!postExtensions.has(path.extname(file))) continue;
    const relative = path.relative(postsDirectory, file);
    // Keep top-level folders for nested posts, as well as flat post slugs.
    postFolders.add(relative.split(path.sep)[0].replace(/\.[^.]+$/, ''));
    postFolders.add(path.basename(file, path.extname(file)));
  }

  if (!fs.existsSync(imagesDirectory)) return [];
  const sources = walk(path.join(root, 'src'))
    .filter(file => textExtensions.has(path.extname(file)))
    .map(file => fs.readFileSync(file, 'utf8'));

  return fs.readdirSync(imagesDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !postFolders.has(entry.name))
    .filter(entry => !sources.some(source =>
      [entry.name, encodeURIComponent(entry.name)].some(name =>
        source.includes(`images/posts/${name}/`))))
    .map(entry => entry.name)
    .sort();
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const candidates = inspectImageFolders(root);
    console.log('图片检查：只列出候选目录，不修改任何文件。');
    if (candidates.length === 0) {
      console.log('没有发现需要复查的图片目录。');
    } else {
      for (const folder of candidates) console.log(`待复查：src/assets/images/posts/${folder}/`);
      console.log('候选目录仍可能通过动态路径或其他位置引用，请人工检查后再决定是否清理。');
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
