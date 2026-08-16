import type { CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { H3Event } from 'h3'
import type { BlogPublication, NormalizedBlogConfig, NormalizedBlogSection } from '../../core'
import { createError, defineEventHandler, getRequestURL, setHeader } from 'h3'
import { queryCollection, useRuntimeConfig } from '#imports'
import { getBlogPostCategories, isBlogPostVisible, joinBlogUrl } from '../../core'

interface FeedPost extends BlogPublication {
  path: string
  title: string
}

type QueryCollectionWithEvent = <T extends keyof Collections>(event: H3Event, collection: T) => CollectionQueryBuilder<Collections[T]>

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function publicationDate(post: FeedPost): Date {
  for (const value of [post.publishedAt, post.date, post.updatedAt]) {
    if (!value)
      continue
    const parsed = new Date(value)
    if (Number.isFinite(parsed.getTime()))
      return parsed
  }
  return new Date(0)
}

function findSection(event: H3Event, path: string): { section: NormalizedBlogSection, format: 'rss' | 'atom' } {
  const config = useRuntimeConfig(event).public.happydesignsBlog as unknown as NormalizedBlogConfig
  for (const section of Object.values(config.sections)) {
    if (!section.features.syndication)
      continue
    if (section.features.syndication.rss === path)
      return { section, format: 'rss' }
    if (section.features.syndication.atom === path)
      return { section, format: 'atom' }
  }
  throw createError({ statusCode: 404, statusMessage: 'Feed not found' })
}

function renderRss(section: NormalizedBlogSection, posts: FeedPost[], siteUrl: string): string {
  if (!section.features.syndication)
    throw new Error(`[happydesigns/blog] Section "${section.key}" has no feed configuration.`)
  const feed = section.features.syndication
  const feedUrl = joinBlogUrl(siteUrl, feed.rss || section.basePath)
  const feedTitle = feed.title || section.title
  const feedDescription = feed.description || section.description || section.title
  const feedLanguage = feed.language || section.locale
  const items = posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(joinBlogUrl(siteUrl, post.path))}</link>
      <guid isPermaLink="true">${escapeXml(joinBlogUrl(siteUrl, post.path))}</guid>
      <pubDate>${publicationDate(post).toUTCString()}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ''}
      ${getBlogPostCategories(post).map(category => `<category>${escapeXml(category)}</category>`).join('')}
    </item>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(joinBlogUrl(siteUrl, section.basePath))}</link>
    <description>${escapeXml(feedDescription)}</description>
    <language>${escapeXml(feedLanguage)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    ${feed.copyright ? `<copyright>${escapeXml(feed.copyright)}</copyright>` : ''}
    ${items}
  </channel>
</rss>`
}

function renderAtom(section: NormalizedBlogSection, posts: FeedPost[], siteUrl: string): string {
  if (!section.features.syndication)
    throw new Error(`[happydesigns/blog] Section "${section.key}" has no feed configuration.`)
  const feed = section.features.syndication
  const feedUrl = joinBlogUrl(siteUrl, feed.atom || section.basePath)
  const feedTitle = feed.title || section.title
  const updated = posts[0] ? publicationDate(posts[0]).toISOString() : new Date().toISOString()
  const entries = posts.map(post => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <id>${escapeXml(joinBlogUrl(siteUrl, post.path))}</id>
    <link href="${escapeXml(joinBlogUrl(siteUrl, post.path))}" />
    <updated>${publicationDate(post).toISOString()}</updated>
    ${post.description ? `<summary>${escapeXml(post.description)}</summary>` : ''}
    ${getBlogPostCategories(post).map(category => `<category term="${escapeXml(category)}" />`).join('')}
  </entry>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(feedTitle)}</title>
  <id>${escapeXml(joinBlogUrl(siteUrl, section.basePath))}</id>
  <link href="${escapeXml(feedUrl)}" rel="self" />
  <link href="${escapeXml(joinBlogUrl(siteUrl, section.basePath))}" />
  <updated>${updated}</updated>
  ${entries}
</feed>`
}

export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  const { section, format } = findSection(event, requestUrl.pathname)
  const siteUrl = section.features.syndication && section.features.syndication.siteUrl
    ? section.features.syndication.siteUrl
    : requestUrl.origin
  const query = (queryCollection as QueryCollectionWithEvent)(event, section.collection as keyof Collections) as unknown as CollectionQueryBuilder<FeedPost>
  const posts = (await query
    .where('published', '=', true)
    .order(section.sort.field as keyof FeedPost & string, section.sort.direction)
    .all())
    .filter(post => isBlogPostVisible(post))

  if (format === 'rss') {
    setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
    return renderRss(section, posts, siteUrl)
  }

  setHeader(event, 'content-type', 'application/atom+xml; charset=utf-8')
  return renderAtom(section, posts, siteUrl)
})
