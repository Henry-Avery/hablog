import { config } from '@keystatic/core';
import { home, navbar, footer, branding, seo } from './src/cms/singletons';
import { posts, spec } from './src/cms/collections';

export default config({
  storage: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
    ? {
        kind: 'github',
        repo: {
          owner: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
          name: import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
        },
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'henryavery.cn' },
    navigation: {
      Content: ['home', 'posts'],
      Components: ['navbar', 'footer'],
      'Site Settings': ['branding', 'seo'],
    },
  },

  collections: {
    posts,
    spec,
  },

  singletons: {
    home,
    navbar,
    footer,
    branding,
    seo
  },
});
