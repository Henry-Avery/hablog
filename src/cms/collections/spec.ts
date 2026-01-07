import { collection, fields } from '@keystatic/core';

export const spec = collection({
  label: 'Special Pages',
  slugField: 'title',
  path: 'src/content/spec/*',
  format: { contentField: 'content' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),
    content: fields.markdoc({
      label: 'Content',
      options: {
        image: {
          directory: 'public/images/spec',
          publicPath: '/images/spec/',
        },
      },
    }),
  },
});
