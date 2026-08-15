import { defineBlogConfig } from '@happydesigns/blog/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Blog',
      description: 'Long-form notes from the happydesigns Blog playground.',
      authors: { collection: 'author' },
      categories: {
        Architecture: { label: 'Architecture', color: 'primary' },
        Workflow: { label: 'Workflow', color: 'info' },
      },
      itemsPerPage: 6,
    },
    news: {
      collection: 'news',
      basePath: '/news',
      title: 'News',
      description: 'A second independent publication section.',
      feed: {
        atom: false,
      },
    },
  },
})
