import { fields, collection } from '@keystatic/core';

export const posts = collection({
  label: 'Posts',
  slugField: 'title',
  path: 'src/content/posts/*',
  entryLayout: 'content',
  format: { contentField: 'content' },
  schema: {
    title: fields.slug({ name: { label: 'Title' } }),

    featuredImage: fields.image({
      label: "Featured Image",
      directory: "src/assets/images/posts",
      publicPath: "../../assets/images/posts/",
    }),

    imgAlt: fields.text({
      label: 'Image Alt',
      description: 'Alternative text for the featured image (for accessibility)'
    }),

    content: fields.markdoc({
      label: "Content",
      options: {
        image: {
          directory: "src/assets/images/posts",
          publicPath: "@assets/images/posts/",
        },
      },
    }),

    excerpt: fields.text({
      label: 'Excerpt',
      multiline: true,
      description: 'A brief description of this article (used in previews and SEO)'
    }),

    publishedDate: fields.date({
      label: "Published date",
      description: "The date this post was published"
    }),

    tags: fields.array(
      fields.text({ label: 'Tag' }),
      {
        label: 'Tags',
        description: 'Add tags to categorize this post',
        itemLabel: props => props.value || 'Tag'
      }
    ),

    category: fields.select({
      label: 'Category',
      description: 'Select a primary category for this post',
      options: [
        { label: 'Technology', value: 'Technology' },
        { label: 'Programming', value: 'Programming' },
        { label: 'Web Development', value: 'Web Development' },
        { label: 'Tutorial', value: 'Tutorial' },
        { label: 'Design', value: 'Design' },
        { label: 'Research', value: 'Research' },
        { label: 'Personal', value: 'Personal' },
        { label: 'Other', value: 'Other' },
      ],
      defaultValue: 'Other'
    }),

    draft: fields.checkbox({
      label: 'Draft',
      description: 'Mark this post as a draft (will not appear on the site)',
      defaultValue: false
    }),
  },
});