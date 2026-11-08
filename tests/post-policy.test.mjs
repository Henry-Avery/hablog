import assert from 'node:assert/strict';
import test from 'node:test';
import { selectPosts } from '../src/utils/post-policy.mjs';

test('production omits drafts and sorts published posts newest first', () => {
  const posts = [
    { id: 'older', data: { publishedDate: new Date('2026-01-01') } },
    { id: 'draft', data: { draft: true, publishedDate: new Date('2026-03-01') } },
    { id: 'newer', data: { draft: false, publishedDate: new Date('2026-02-01') } },
  ];
  assert.deepEqual(selectPosts(posts).map(post => post.id), ['newer', 'older']);
  assert.deepEqual(posts.map(post => post.id), ['older', 'draft', 'newer']);
  assert.deepEqual(selectPosts(posts, { includeDrafts: true }).map(post => post.id),
    ['draft', 'newer', 'older']);
});

test('missing and invalid dates have a stable order without breaking rendering', () => {
  const posts = [
    { id: 'z-missing', data: {} },
    { id: 'dated', data: { publishedDate: '2026-01-01' } },
    { id: 'historical', data: { publishedDate: '1960-01-01' } },
    { id: 'a-invalid', data: { publishedDate: 'invalid' } },
  ];
  assert.deepEqual(selectPosts(posts).map(post => post.id),
    ['dated', 'historical', 'a-invalid', 'z-missing']);
});
