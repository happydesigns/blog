import { defineBlogCollections } from '@happydesigns/blog/content'
import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import blog from './blog.config'

export default defineContentConfig({
  collections: {
    ...defineBlogCollections(blog, {
      blog: {
        source: 'blog/**/*.md',
        schema: {
          campaign: z.string().optional(),
        },
      },
      news: {
        source: 'news/**/*.md',
      },
    }),
    author: defineCollection({
      type: 'data',
      source: 'users/**/*.yaml',
      schema: z.object({
        username: z.string(),
        name: z.string(),
        description: z.string().optional(),
      }),
    }),
  },
})
