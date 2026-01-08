import { config } from '@keystatic/core';
import { home, navbar, footer, branding, seo } from './src/cms/singletons';
import { posts, spec } from './src/cms/collections';

export default config({
  // 直接指定 GitHub 模式，让 Keystatic 插件自动注入 Client ID/Secret
  // 仓库信息是公开的，硬编码是安全的
  storage: {
    kind: 'github',
    repo: 'Henry-Avery/hablog',
  },

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
