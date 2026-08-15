import { defineContentConfig } from '@nuxt/content'
import { defineBlogCollections } from '../../../src/content'
import blog from './blog.config'

export default defineContentConfig({
  collections: defineBlogCollections(blog, {
    blog: { source: 'blog/**/*.md' },
    news: { source: 'news/**/*.md' },
  }),
})
