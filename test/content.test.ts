import { z } from 'zod'
import { describe, expect, it } from 'vitest'
import {
  blogCollectionIndexes,
  blogPostSchema,
  defineBlogCollections,
} from '../src/content'

describe('Nuxt Content contract', () => {
  it('keeps incomplete legacy drafts valid and defaults publication', async () => {
    const result = await blogPostSchema['~standard'].validate({})
    expect(result).toMatchObject({ value: { published: true, toc: true } })
  })

  it('supports project schema extensions and publication indexes', async () => {
    const extended = blogPostSchema.extend({ tournament: z.string().optional() })
    const result = await extended['~standard'].validate({ tournament: 'open-2026' })

    expect(result).toMatchObject({ value: { tournament: 'open-2026', published: true } })
    expect(blogCollectionIndexes).toEqual([
      { columns: ['published', 'date'] },
      { columns: ['published', 'category', 'date'] },
      { columns: ['status', 'publishedAt'] },
    ])
  })

  it('requires one definition for every configured section', () => {
    expect(() => defineBlogCollections({
      sections: { blog: { collection: 'article' } },
    }, {})).toThrow('Missing collection definition')
  })
})
