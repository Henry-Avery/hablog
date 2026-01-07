#!/usr/bin/env node

/**
 * 清理孤立的文章图片文件夹
 *
 * 功能：
 * 1. 扫描 src/content/posts/ 获取所有存在的文章
 * 2. 扫描 src/assets/images/posts/ 获取所有图片文件夹
 * 3. 删除没有对应文章的图片文件夹
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/content/posts');
const IMAGES_DIR = path.join(__dirname, '../src/assets/images/posts');

function getPostSlugs() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('⚠️  Posts directory not found');
    return new Set();
  }

  const files = fs.readdirSync(POSTS_DIR);
  const slugs = new Set();

  files.forEach(file => {
    // 获取不带扩展名的文件名作为 slug
    if (file.endsWith('.mdoc')) {
      const slug = file.replace('.mdoc', '');
      slugs.add(slug);
    }
  });

  return slugs;
}

function getImageFolders() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('ℹ️  Images directory not found, nothing to clean');
    return [];
  }

  const items = fs.readdirSync(IMAGES_DIR);
  const folders = [];

  items.forEach(item => {
    const fullPath = path.join(IMAGES_DIR, item);
    if (fs.statSync(fullPath).isDirectory()) {
      folders.push(item);
    }
  });

  return folders;
}

function cleanOrphanedImages() {
  console.log('🧹 Starting orphaned images cleanup...\n');

  const postSlugs = getPostSlugs();
  const imageFolders = getImageFolders();

  console.log(`📝 Found ${postSlugs.size} posts`);
  console.log(`🖼️  Found ${imageFolders.length} image folders\n`);

  let deletedCount = 0;
  const orphanedFolders = [];

  imageFolders.forEach(folder => {
    if (!postSlugs.has(folder)) {
      orphanedFolders.push(folder);
    }
  });

  if (orphanedFolders.length === 0) {
    console.log('✅ No orphaned image folders found!');
    return;
  }

  console.log(`🗑️  Found ${orphanedFolders.length} orphaned image folder(s):\n`);

  orphanedFolders.forEach(folder => {
    const folderPath = path.join(IMAGES_DIR, folder);
    try {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`   ✓ Deleted: ${folder}`);
      deletedCount++;
    } catch (error) {
      console.error(`   ✗ Failed to delete ${folder}:`, error.message);
    }
  });

  console.log(`\n✅ Cleanup complete! Deleted ${deletedCount} folder(s)`);
}

// 运行清理
cleanOrphanedImages();
