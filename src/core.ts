export type BlogPublicationStatus = 'draft' | 'scheduled' | 'published'
export type BlogSortDirection = 'ASC' | 'DESC'

export interface BlogCategoryOptions {
  label?: string
  color?: string
  icon?: string
}

export interface BlogLabels {
  all: string
  empty: string
  previous: string
  next: string
}

export interface BlogSectionRoutes {
  index: string | false
  post: string | false
  category: string | false
  tag: string | false
  author: string | false
}

export interface BlogFeedOptions {
  rss?: string | false
  atom?: string | false
  title?: string
  description?: string
  siteUrl?: string
  language?: string
  copyright?: string
  favicon?: string
}

export interface BlogAuthorOptions {
  collection: string
}

export interface BlogListFeatureOptions {
  previewImages?: boolean
}

export interface BlogTaxonomyFeatureOptions {
  categories?: Record<string, BlogCategoryOptions>
}

export interface BlogSectionFeatures {
  list?: BlogListFeatureOptions
  authors?: BlogAuthorOptions | false
  taxonomy?: BlogTaxonomyFeatureOptions | false
  syndication?: BlogFeedOptions | false
}

export interface BlogSectionOptions {
  collection: string
  basePath?: string
  title?: string
  description?: string
  locale?: string
  itemsPerPage?: number
  features?: BlogSectionFeatures
  /** @deprecated Use `features.list.previewImages`. */
  showPreviewImages?: boolean
  sort?: {
    field?: string
    direction?: BlogSortDirection
  }
  /** @deprecated Use `features.taxonomy.categories`. */
  categories?: Record<string, BlogCategoryOptions>
  labels?: Partial<BlogLabels>
  /** @deprecated Use `features.authors`. */
  authors?: BlogAuthorOptions | false
  routes?: Partial<BlogSectionRoutes> | false
  /** @deprecated Use `features.syndication`. */
  feed?: BlogFeedOptions | false
}

export interface BlogModuleOptions {
  sections?: Record<string, BlogSectionOptions>
}

export interface NormalizedBlogSection {
  key: string
  collection: string
  basePath: string
  title: string
  description?: string
  locale: string
  itemsPerPage: number
  sort: {
    field: string
    direction: BlogSortDirection
  }
  labels: BlogLabels
  features: {
    list: Required<BlogListFeatureOptions>
    authors: BlogAuthorOptions | false
    taxonomy: Required<BlogTaxonomyFeatureOptions> | false
    syndication: Required<Pick<BlogFeedOptions, 'rss' | 'atom'>> & Omit<BlogFeedOptions, 'rss' | 'atom'> | false
  }
  routes: BlogSectionRoutes
}

export interface NormalizedBlogConfig {
  sections: Record<string, NormalizedBlogSection>
}

export interface BlogPublication {
  path?: string
  title?: string
  description?: string
  date?: string | Date
  publishedAt?: string | Date
  updatedAt?: string | Date
  published?: boolean
  status?: BlogPublicationStatus
  authors?: string[]
  category?: string
  categories?: string[]
  tags?: string[]
  image?: {
    src: string
    alt?: string
    width?: number
    height?: number
    position?: string
  }
  [key: string]: unknown
}

const defaultLabels: BlogLabels = {
  all: 'All',
  empty: 'No posts found.',
  previous: 'Previous',
  next: 'Next',
}

export function defineBlogConfig<const T extends BlogModuleOptions>(config: T): T {
  return config
}

export function normalizeBasePath(path: string): string {
  const trimmed = path.trim()
  if (!trimmed)
    return '/'

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const normalized = withLeadingSlash.replace(/\/{2,}/g, '/').replace(/\/$/, '')
  return normalized || '/'
}

function normalizeRoute(path: string | false | undefined, fallback: string): string | false {
  if (path === false)
    return false
  return normalizeBasePath(path ?? fallback)
}

export function normalizeBlogConfig(options: BlogModuleOptions = {}): NormalizedBlogConfig {
  const inputSections = options.sections && Object.keys(options.sections).length > 0
    ? options.sections
    : { blog: { collection: 'blog', basePath: '/blog' } }

  const sections: Record<string, NormalizedBlogSection> = {}
  const registeredRoutes = new Map<string, string>()

  for (const [key, input] of Object.entries(inputSections)) {
    if (!/^[a-z][a-z0-9-]*$/i.test(key))
      throw new Error(`[happydesigns/blog] Invalid section key "${key}".`)
    if (!input.collection?.trim())
      throw new Error(`[happydesigns/blog] Section "${key}" needs a collection.`)

    const basePath = normalizeBasePath(input.basePath ?? `/${key}`)
    const routesDisabled = input.routes === false
    let routeInput: Partial<BlogSectionRoutes> = {}
    if (input.routes)
      routeInput = input.routes
    const routes: BlogSectionRoutes = {
      index: routesDisabled ? false : normalizeRoute(routeInput?.index, basePath),
      post: routesDisabled ? false : normalizeRoute(routeInput?.post, `${basePath}/[...slug]`),
      category: routesDisabled ? false : normalizeRoute(routeInput?.category, `${basePath}/category/:category`),
      tag: routesDisabled ? false : normalizeRoute(routeInput?.tag, `${basePath}/tag/:tag`),
      author: routesDisabled ? false : normalizeRoute(routeInput?.author, `${basePath}/author/:author`),
    }

    const syndicationInput = input.features?.syndication !== undefined
      ? input.features.syndication
      : input.feed
    const syndication = syndicationInput === false
      ? false
      : {
          ...syndicationInput,
          rss: normalizeRoute(syndicationInput?.rss, `${basePath}/rss.xml`),
          atom: normalizeRoute(syndicationInput?.atom, `${basePath}/atom.xml`),
        }

    const authors = input.features?.authors !== undefined
      ? input.features.authors
      : input.authors ?? false
    const taxonomyInput = input.features?.taxonomy !== undefined
      ? input.features.taxonomy
      : { categories: input.categories }
    const taxonomy = taxonomyInput === false
      ? false
      : { categories: taxonomyInput.categories ?? {} }
    const previewImages = input.features?.list?.previewImages
      ?? input.showPreviewImages
      ?? true

    for (const [routeKind, route] of Object.entries({ ...routes, rss: syndication && syndication.rss, atom: syndication && syndication.atom })) {
      if (!route)
        continue
      const owner = registeredRoutes.get(route)
      if (owner)
        throw new Error(`[happydesigns/blog] Route "${route}" is used by both ${owner} and ${key}.${routeKind}.`)
      registeredRoutes.set(route, `${key}.${routeKind}`)
    }

    sections[key] = {
      key,
      collection: input.collection,
      basePath,
      title: input.title ?? key.charAt(0).toUpperCase() + key.slice(1),
      description: input.description,
      locale: input.locale ?? 'en',
      itemsPerPage: input.itemsPerPage ?? 12,
      sort: {
        field: input.sort?.field ?? 'date',
        direction: input.sort?.direction ?? 'DESC',
      },
      labels: { ...defaultLabels, ...input.labels },
      features: {
        list: { previewImages },
        authors,
        taxonomy,
        syndication,
      },
      routes,
    }
  }

  return { sections }
}

function toTimestamp(value: unknown): number | null {
  if (!(value instanceof Date) && typeof value !== 'string')
    return null
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) ? timestamp : null
}

export function isBlogPostVisible(post: BlogPublication, now: Date = new Date()): boolean {
  if (post.published === false || post.status === 'draft')
    return false

  const publishAt = toTimestamp(post.publishedAt)
  if (publishAt !== null && publishAt > now.getTime())
    return false

  if (post.status === 'scheduled')
    return publishAt !== null && publishAt <= now.getTime()

  return true
}

export function getBlogPostCategories(post: BlogPublication): string[] {
  return [...new Set([
    ...(post.category ? [post.category] : []),
    ...(post.categories ?? []),
  ])]
}

export function joinBlogUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
