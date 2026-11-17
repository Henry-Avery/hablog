/**
 * One visibility and sorting policy for pages, navigation, and static output.
 * @template {{ id: string, data: { draft?: boolean, publishedDate?: Date | string } }} T
 * @param {T[]} posts
 * @param {{ includeDrafts?: boolean }} options
 * @returns {T[]}
 */
export function selectPosts(posts, { includeDrafts = false } = {}) {
  const timestamp = post => {
    const value = post.data.publishedDate;
    const time = value ? new Date(value).getTime() : Number.NaN;
    return Number.isFinite(time) ? time : Number.NEGATIVE_INFINITY;
  };

  return posts
    .filter(post => includeDrafts || post.data.draft !== true)
    .sort((a, b) => timestamp(b) - timestamp(a) || a.id.localeCompare(b.id));
}
