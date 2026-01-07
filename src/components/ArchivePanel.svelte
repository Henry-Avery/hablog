<script lang="ts">
import { onMount } from "svelte";

export let posts: Post[] = [];

interface Post {
	id: string;
	data: {
		title: string;
		publishedDate: Date;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = [];

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

onMount(() => {
	// Sort posts by date descending
	const sortedPosts = posts
		.slice()
		.sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime());

	// Group by year
	const grouped = sortedPosts.reduce(
		(acc, post) => {
			const year = post.data.publishedDate.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	groups = groupedPostsArray;
});
</script>

<div class="card bg-base-100 shadow-xl p-6">
	{#each groups as group}
		<div class="mb-8 last:mb-0">
			<!-- Year Header -->
			<div class="flex items-center h-16">
				<div class="w-[15%] md:w-[10%] text-2xl font-bold text-right opacity-70">
					{group.year}
				</div>
				<div class="w-[15%] md:w-[10%]">
					<div class="h-3 w-3 rounded-full bg-primary mx-auto ring-4 ring-base-300"></div>
				</div>
				<div class="w-[70%] md:w-[80%] text-left opacity-60">
					{group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
				</div>
			</div>

			<!-- Posts in this year -->
			{#each group.posts as post}
				<a
					href={`/posts/${post.id}`}
					class="group flex items-center h-12 hover:bg-base-200 rounded-lg transition-all"
				>
					<!-- Date -->
					<div class="w-[15%] md:w-[10%] text-sm text-right opacity-60">
						{formatDate(post.data.publishedDate)}
					</div>

					<!-- Dot and line -->
					<div class="w-[15%] md:w-[10%] relative flex items-center h-full">
						<div class="absolute left-1/2 top-0 bottom-0 w-px bg-base-300 -translate-x-1/2"></div>
						<div
							class="relative mx-auto w-1.5 h-1.5 rounded-full bg-base-content/40
							       group-hover:w-2 group-hover:h-5 group-hover:bg-primary
							       transition-all z-10 ring-4 ring-base-100 group-hover:ring-base-200"
						></div>
					</div>

					<!-- Title -->
					<div
						class="w-[70%] md:w-[70%] font-bold group-hover:text-primary
						       group-hover:translate-x-1 transition-all pr-4
						       whitespace-nowrap overflow-hidden text-ellipsis"
					>
						{post.data.title}
					</div>
				</a>
			{/each}
		</div>
	{/each}
</div>

<style>
	/* Remove dash line background for cleaner look */
	.dash-line::before {
		display: none;
	}
</style>
