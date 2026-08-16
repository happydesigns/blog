import { defineBlogConfig } from '@happydesigns/blog/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Blog',
      description: 'Long-form notes from the happydesigns Blog playground.',
      features: {
        authors: { collection: 'author' },
        taxonomy: {
          categories: {
            Architecture: { label: 'Architecture', color: 'primary' },
            Workflow: { label: 'Workflow', color: 'info' },
          },
        },
      },
      itemsPerPage: 6,
    },
    news: {
      collection: 'news',
      basePath: '/news',
      title: 'News',
      description: 'A second independent publication section.',
      features: {
        syndication: {
          atom: false,
        },
      },
    },
  },
})
