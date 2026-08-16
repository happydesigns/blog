import { defineBlogConfig } from '@happydesigns/blog/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Publishing notes',
      description: 'Ideas and field notes about building flexible content experiences.',
      labels: {
        all: 'All posts',
        empty: 'No published posts yet.',
      },
      features: {
        authors: { collection: 'author' },
        taxonomy: {
          categories: {
            Architecture: { label: 'Architecture', color: 'primary' },
            Product: { label: 'Product', color: 'success' },
            Workflow: { label: 'Workflow', color: 'info' },
          },
        },
      },
      itemsPerPage: 6,
    },
    news: {
      collection: 'news',
      basePath: '/news',
      title: 'Release notes',
      description: 'A second publication section with its own content and routes.',
      features: {
        syndication: {
          atom: false,
        },
      },
    },
  },
})
