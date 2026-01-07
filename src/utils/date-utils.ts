/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式字符串，如 "YYYY-MM-DD"
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | undefined, format: string = "YYYY-MM-DD"): string {
	if (!date) return "N/A";

	const d = typeof date === "string" ? new Date(date) : date;

	if (isNaN(d.getTime())) return "Invalid Date";

	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");

	return format
		.replace("YYYY", String(year))
		.replace("MM", month)
		.replace("DD", day);
}

/**
 * 计算相对时间（如"3天前"）
 * @param date 日期对象或字符串
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | string): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diff = now.getTime() - d.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
	if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
	if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	return "Just now";
}

/**
 * 按年份分组文章
 * @param posts 文章数组
 * @returns 按年份分组的文章对象
 */
export function groupPostsByYear<T extends { data: { published?: Date | string } }>(
	posts: T[]
): Record<string, T[]> {
	const grouped: Record<string, T[]> = {};

	posts.forEach((post) => {
		if (!post.data.published) return;

		const date = typeof post.data.published === "string"
			? new Date(post.data.published)
			: post.data.published;

		if (isNaN(date.getTime())) return;

		const year = date.getFullYear().toString();
		if (!grouped[year]) {
			grouped[year] = [];
		}
		grouped[year].push(post);
	});

	return grouped;
}
