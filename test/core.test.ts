import { describe, expect, it } from 'vitest'
import {
  defineBlogConfig,
  getBlogPostCategories,
  isBlogPostVisible,
  normalizeBlogConfig,
} from '../src/core'

describe('publication visibility', () => {
  const now = new Date('2026-08-15T12:00:00Z')

  it('preserves legacy published documents', () => {
    expect(isBlogPostVisible({ published: true }, now)).toBe(true)
    expect(isBlogPostVisible({ published: false }, now)).toBe(false)
  })

  it('handles drafts and scheduled publication consistently', () => {
    expect(isBlogPostVisible({ published: true, status: 'draft' }, now)).toBe(false)
    expect(isBlogPostVisible({ published: true, status: 'scheduled', publishedAt: '2026-08-15T11:00:00Z' }, now)).toBe(true)
    expect(isBlogPostVisible({ published: true, status: 'scheduled', publishedAt: '2026-08-15T13:00:00Z' }, now)).toBe(false)
    expect(isBlogPostVisible({ published: true, status: 'scheduled' }, now)).toBe(false)
    expect(isBlogPostVisible({ published: true, status: 'published', publishedAt: '2026-08-15T13:00:00Z' }, now)).toBe(false)
  })
})

describe('section configuration', () => {
  it('normalizes independent routes for several sections', () => {
    const config = normalizeBlogConfig(defineBlogConfig({
      sections: {
        blog: { collection: 'article', basePath: '/blog' },
        news: { collection: 'news', basePath: '/news', feed: false },
      },
    }))

    expect(config.sections.blog?.routes.post).toBe('/blog/[...slug]')
    expect(config.sections.blog?.feed && config.sections.blog.feed.rss).toBe('/blog/rss.xml')
    expect(config.sections.news?.routes.category).toBe('/news/category/:category')
    expect(config.sections.news?.feed).toBe(false)
  })

  it('rejects route collisions', () => {
    expect(() => normalizeBlogConfig({
      sections: {
        blog: { collection: 'article', basePath: '/blog' },
        news: { collection: 'news', basePath: '/blog' },
      },
    })).toThrow('used by both')
  })

  it('combines legacy and plural categories without duplicates', () => {
    expect(getBlogPostCategories({ category: 'News', categories: ['News', 'Release'] }))
      .toEqual(['News', 'Release'])
  })
})
