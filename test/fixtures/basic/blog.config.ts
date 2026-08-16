import { defineBlogConfig } from '../../../src/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Blog',
      itemsPerPage: 1,
      features: {
        taxonomy: { categories: { General: { color: 'primary' } } },
      },
    },
    news: {
      collection: 'news',
      basePath: '/news',
      title: 'News',
      features: { syndication: false },
    },
  },
})
