import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { inspectImageFolders } from '../scripts/check-orphaned-images.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hablog-images-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, content = '') => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };
  return { root, write };
}

test('keeps supported posts, nested posts, and shared image references; audit never deletes', t => {
  const { root, write } = fixture(t);
  for (const extension of ['md', 'mdx', 'mdoc', 'yaml', 'json']) {
    write(`src/content/posts/post-${extension}.${extension}`, 'title: Example');
    write(`src/assets/images/posts/post-${extension}/cover.png`, 'image');
  }
  write('src/content/posts/travel/entry.mdoc', 'Nested post');
  write('src/assets/images/posts/travel/cover.png', 'image');
  write('src/assets/images/posts/entry/cover.png', 'image');
  write('src/pages/about.astro', '<img src="@assets/images/posts/shared/cover.png">');
  write('src/assets/images/posts/shared/cover.png', 'image');
  write('src/assets/images/posts/unreferenced/cover.png', 'keep me');
  assert.deepEqual(inspectImageFolders(root), ['unreferenced']);
  assert.equal(fs.readFileSync(path.join(root, 'src/assets/images/posts/unreferenced/cover.png'), 'utf8'), 'keep me');
  assert.ok(fs.existsSync(path.join(root, 'src/assets/images/posts/shared/cover.png')));
});

test('missing post directory fails without altering image files', t => {
  const { root, write } = fixture(t);
  write('src/assets/images/posts/keep/cover.png', 'image');
  assert.throws(() => inspectImageFolders(root), /文章目录不存在/);
  assert.ok(fs.existsSync(path.join(root, 'src/assets/images/posts/keep/cover.png')));
});

test('does not follow symlink image folders', t => {
  const { root, write } = fixture(t);
  write('src/content/posts/post.mdoc', 'Post');
  write('outside/cover.png', 'image');
  fs.mkdirSync(path.join(root, 'src/assets/images/posts'), { recursive: true });
  fs.symlinkSync(path.join(root, 'outside'), path.join(root, 'src/assets/images/posts/linked'));
  assert.deepEqual(inspectImageFolders(root), []);
  assert.ok(fs.existsSync(path.join(root, 'outside/cover.png')));
});
