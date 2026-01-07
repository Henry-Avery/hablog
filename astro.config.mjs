import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// Markdown plugins
import remarkDirective from 'remark-directive';
import remarkGithubAdmonitionsToDirectives from 'remark-github-admonitions-to-directives';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeAdmonition } from './src/plugins/rehype-component-admonition.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    svelte(),
    markdoc({
      allowHTML: true,
    }),
    keystatic()
  ],
  output: 'server',
  adapter: vercel(),
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkGithubAdmonitionsToDirectives,
      remarkMath,
    ],
    rehypePlugins: [
      rehypeKatex,
      rehypeAdmonition,
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['/_pagefind/pagefind.js']
      }
    }
  },
});