import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createPost, findPost, inspectPost, markPublished, readPost, shanghaiDate, templates } from '../scripts/posts.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hablog-posts-'));
  fs.mkdirSync(path.join(root, 'src/content/posts'), { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('all daily templates create parseable drafts with Chinese titles and valid dates', t => {
  const root = fixture(t);
  for (const template of templates) {
    const file = createPost(root, `test-${template}`, { title: '读书："引用" # 笔记', template, date: '2026-10-15' });
    const post = readPost(file);
    assert.equal(post.data.title, '读书："引用" # 笔记');
    assert.equal(post.data.draft, true);
    assert.equal(post.data.publishedDate, '2026-10-15');
    assert.deepEqual(inspectPost(post).errors, []);
    assert.ok(inspectPost(post, { ready: true }).errors.length > 0);
  }
});

test('new post rejects paths, case-insensitive collisions and invalid dates without overwriting files', t => {
  const root = fixture(t);
  const source = path.join(root, 'src/content/posts/Existing.md');
  fs.writeFileSync(source, 'original');
  for (const slug of ['../escape', '/tmp/escape', 'Bad Name', 'existing']) {
    assert.throws(() => createPost(root, slug, { title: 'Title' }));
  }
  assert.throws(() => createPost(root, 'bad-date', { title: 'Title', date: '2026-02-30' }));
  assert.equal(fs.readFileSync(source, 'utf8'), 'original');
  assert.deepEqual(fs.readdirSync(path.dirname(source)), ['Existing.md']);
});

test('Shanghai date crosses midnight independently of the execution host timezone', () => {
  assert.equal(shanghaiDate(new Date('2026-10-14T16:30:00Z')), '2026-10-15');
});

test('publish refuses unfinished or invalid posts and leaves their bytes unchanged', t => {
  const root = fixture(t);
  const file = createPost(root, 'unfinished', { title: '未写完' });
  const source = fs.readFileSync(file, 'utf8');
  assert.throws(() => markPublished(root, 'unfinished'), /发布检查未通过/);
  assert.equal(fs.readFileSync(file, 'utf8'), source);
  const invalid = { data: { title: 'Title', draft: 'false', tags: 'tag', publishedDate: '2026-02-30' }, body: '正文' };
  assert.equal(inspectPost(invalid).errors.length, 3);
});

test('publish handles uploaded Markdown, preserves body and metadata comments, and targets only one post', t => {
  const root = fixture(t);
  const file = path.join(root, 'src/content/posts/upload.md');
  const body = '# Title\n\n实际正文。\n\n---\n\n```yaml\ndraft: true\n```\n';
  fs.writeFileSync(file, '---\ntitle: 上传文章\npublishedDate: 2026-10-15\ndraft: true # keep comment\ntags: [写作]\nexcerpt: |-\n  第一行\n  第二行\n---\n' + body);
  const other = createPost(root, 'other', { title: '另一篇' });
  const before = fs.readFileSync(other, 'utf8');
  markPublished(root, 'upload');
  const post = findPost(root, 'upload');
  assert.equal(post.data.draft, false);
  assert.equal(post.data.excerpt, '第一行\n第二行');
  assert.equal(post.body, body);
  assert.match(fs.readFileSync(file, 'utf8'), /# keep comment/);
  assert.equal(fs.readFileSync(other, 'utf8'), before);
});

test('invalid YAML and missing frontmatter fail explicitly', t => {
  const root = fixture(t);
  const file = path.join(root, 'src/content/posts/bad.md');
  fs.writeFileSync(file, '# No frontmatter');
  assert.throws(() => readPost(file), /缺少 YAML frontmatter/);
  fs.writeFileSync(file, '---\ntitle: [unterminated\n---\nBody');
  assert.throws(() => readPost(file), /YAML 无法解析/);
});
