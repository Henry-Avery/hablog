/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Pagefind types
interface SearchResult {
  url: string
  meta: { title: string; image?: string }
  excerpt: string
  sub_results: Array<{
    title: string
    url: string
    excerpt: string
  }>
}

interface Pagefind {
  search: (query: string) => Promise<{
    results: Array<{ data: () => Promise<SearchResult> }>
  }>
  options: (config: { excerptLength?: number }) => Promise<void>
}

interface Window {
  pagefind?: Pagefind
}
