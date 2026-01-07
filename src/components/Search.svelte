<script lang="ts">
import { onMount } from "svelte";
import { panelManager } from "../utils/panel-manager.js";

let keyword = "";
let result: SearchResult[] = [];
let isSearching = false;
let pagefindLoaded = false;
let initialized = false;

const fakeResult: SearchResult[] = [
	{
		url: "/",
		meta: {
			title: "This Is a Fake Search Result",
		},
		excerpt:
			"Because the search cannot work in the <mark>dev</mark> environment.",
	},
	{
		url: "/",
		meta: {
			title: "If You Want to Test the Search",
		},
		excerpt: "Try running <mark>pnpm build && pnpm preview</mark> instead.",
	},
];

const togglePanel = async () => {
	await panelManager.togglePanel("search-panel");
};

const closeSearchPanel = async (): Promise<void> => {
	await panelManager.closePanel("search-panel");
	keyword = "";
	result = [];
};

const handleResultClick = (event: Event, url: string): void => {
	event.preventDefault();
	closeSearchPanel();
	window.location.href = url;
};

const search = async (keyword: string): Promise<void> => {
	if (!keyword) {
		result = [];
		return;
	}

	if (!initialized) {
		return;
	}

	isSearching = true;

	try {
		let searchResults: SearchResult[] = [];

		if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
			const response = await window.pagefind.search(keyword);
			searchResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
		} else if (import.meta.env.DEV) {
			searchResults = fakeResult;
		} else {
			searchResults = [];
			console.error("Pagefind is not available in production environment.");
		}

		result = searchResults;
		if (result.length > 0) {
			await panelManager.togglePanel("search-panel", true);
		}
	} catch (error) {
		console.error("Search error:", error);
		result = [];
	} finally {
		isSearching = false;
	}
};

onMount(() => {
	const initializeSearch = () => {
		initialized = true;
		pagefindLoaded =
			typeof window !== "undefined" &&
			!!window.pagefind &&
			typeof window.pagefind.search === "function";
		console.log("Pagefind status on init:", pagefindLoaded);
		if (keyword) search(keyword);
	};

	if (import.meta.env.DEV) {
		console.log(
			"Pagefind is not available in development mode. Using mock data.",
		);
		initializeSearch();
	} else {
		document.addEventListener("pagefindready", () => {
			console.log("Pagefind ready event received.");
			initializeSearch();
		});
		document.addEventListener("pagefindloaderror", () => {
			console.warn(
				"Pagefind load error event received. Search functionality will be limited.",
			);
			initializeSearch();
		});

		setTimeout(() => {
			if (!initialized) {
				console.log("Fallback: Initializing search after timeout.");
				initializeSearch();
			}
		}, 2000);
	}
});

$: if (initialized && keyword) {
	(async () => {
		await search(keyword);
	})();
}
</script>

<!-- search button -->
<button on:click={togglePanel} aria-label="Search" class="btn btn-ghost btn-circle">
	<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
	</svg>
</button>

<!-- search panel -->
<div id="search-panel" class="float-panel-closed fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-[30rem] z-50">
	<div class="card bg-base-100 shadow-2xl p-4">
		<!-- search input -->
		<div class="form-control">
			<input
				type="text"
				placeholder="Search..."
				bind:value={keyword}
				class="input input-bordered w-full"
			/>
		</div>

		<!-- search results -->
		{#if result.length > 0}
			<div class="mt-4 space-y-2 max-h-96 overflow-y-auto">
				{#each result as item}
					<a href={item.url}
						on:click={(e) => handleResultClick(e, item.url)}
						class="block p-3 rounded-lg hover:bg-base-200 transition-colors">
						<div class="font-bold text-primary flex items-center gap-2">
							{item.meta.title}
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
							</svg>
						</div>
						<div class="text-sm text-base-content/70 mt-1">
							{@html item.excerpt}
						</div>
					</a>
				{/each}
			</div>
		{/if}

		{#if isSearching}
			<div class="mt-4 text-center">
				<span class="loading loading-spinner loading-sm"></span>
			</div>
		{/if}
	</div>
</div>

<style>
.float-panel-closed {
	display: none;
}
</style>
