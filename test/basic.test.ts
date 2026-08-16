import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('Nuxt module runtime', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders independent Blog and News sections', async () => {
    const blog = await $fetch<string>('/blog')
    expect(blog).toContain('Blog')
    expect(blog).toContain('/fixture-preview.svg')
    expect(await $fetch('/blog/hello')).toContain('Hello Blog')
    expect(await $fetch('/news')).toContain('News')
    expect(await $fetch('/news/release')).toContain('News Release')
  })

  it('renders archives and hides unpublished documents', async () => {
    expect(await $fetch('/blog/category/General')).toContain('Hello Blog')
    await expect($fetch('/blog/draft')).rejects.toMatchObject({ statusCode: 404 })
  })

  it('generates RSS and Atom feeds from the same visibility policy', async () => {
    const rss = await $fetch<string>('/blog/rss.xml', { responseType: 'text' })
    expect(rss).toContain('<title>Hello Blog</title>')
    expect(rss).not.toContain('Hidden Draft')

    const atom = await $fetch<string>('/blog/atom.xml', { responseType: 'text' })
    expect(atom).toContain('<title>Hello Blog</title>')
    expect(atom).not.toContain('Hidden Draft')
  })
})
