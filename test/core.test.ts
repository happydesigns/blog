import { describe, expect, it } from 'vitest'
import {
  defineBlogConfig,
  getBlogPostCategories,
  isBlogPostVisible,
  normalizeBlogConfig,
  paginateBlogItems,
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

describe('pagination', () => {
  const items = ['first', 'second', 'third', 'fourth', 'fifth']

  it('returns the requested page and total metadata', () => {
    expect(paginateBlogItems(items, 2, 2)).toEqual({
      items: ['third', 'fourth'],
      page: 2,
      pageCount: 3,
      total: 5,
    })
  })

  it('clamps invalid and out-of-range pages', () => {
    expect(paginateBlogItems(items, 99, 2)).toMatchObject({ items: ['fifth'], page: 3 })
    expect(paginateBlogItems(items, Number.NaN, 2)).toMatchObject({ items: ['first', 'second'], page: 1 })
    expect(paginateBlogItems([], 99, 2)).toEqual({ items: [], page: 1, pageCount: 0, total: 0 })
  })
})

describe('section configuration', () => {
  it('normalizes independent routes for several sections', () => {
    const config = normalizeBlogConfig(defineBlogConfig({
      sections: {
        blog: { collection: 'article', basePath: '/blog' },
        news: { collection: 'news', basePath: '/news', features: { syndication: false } },
      },
    }))

    expect(config.sections.blog?.routes.post).toBe('/blog/[...slug]')
    expect(config.sections.blog?.features.list.previewImages).toBe(true)
    expect(config.sections.blog?.features.syndication && config.sections.blog.features.syndication.rss).toBe('/blog/rss.xml')
    expect(config.sections.news?.routes.category).toBe('/news/category/:category')
    expect(config.sections.news?.features.syndication).toBe(false)
  })

  it('allows sections to hide list preview images', () => {
    const config = normalizeBlogConfig({
      sections: {
        blog: { collection: 'article', features: { list: { previewImages: false } } },
      },
    })

    expect(config.sections.blog?.features.list.previewImages).toBe(false)
  })

  it('keeps legacy flat feature options compatible', () => {
    const config = normalizeBlogConfig({
      sections: {
        blog: {
          collection: 'article',
          authors: { collection: 'user' },
          categories: { News: { label: 'News' } },
          feed: false,
          showPreviewImages: false,
        },
      },
    })

    expect(config.sections.blog?.features).toMatchObject({
      authors: { collection: 'user' },
      list: { previewImages: false },
      syndication: false,
      taxonomy: { categories: { News: { label: 'News' } } },
    })
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
