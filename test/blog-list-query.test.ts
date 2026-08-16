import { describe, expect, it } from 'vitest'
import { buildBlogListQuery, readBlogPage } from '../src/runtime/app/utils/blogListQuery'

describe('Blog list query state', () => {
  it('keeps unrelated query values while changing pages', () => {
    expect(buildBlogListQuery({ search: 'nuxt', category: 'Product' }, {
      page: 2,
      selectedCategory: 'Product',
      allLabel: 'All',
    })).toEqual({ search: 'nuxt', category: 'Product', page: '2' })
  })

  it('resets pagination when a category changes', () => {
    expect(buildBlogListQuery({ page: '4', search: 'nuxt' }, {
      page: 4,
      selectedCategory: 'Architecture',
      allLabel: 'All',
      resetPage: true,
    })).toEqual({ search: 'nuxt', category: 'Architecture' })
  })

  it('normalizes invalid page query values', () => {
    expect(readBlogPage('-4')).toBe(1)
    expect(readBlogPage('2.8')).toBe(2)
    expect(readBlogPage('not-a-page')).toBe(1)
    expect(readBlogPage(['3', '4'])).toBe(3)
  })
})
