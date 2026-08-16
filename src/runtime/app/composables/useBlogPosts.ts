import type { CollectionItemBase, CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { BadgeProps, UserProps } from '@nuxt/ui'
import type { MaybeRefOrGetter } from 'vue'
import type { BlogPublication } from '../../../core'
import { computed, toValue } from 'vue'
import { queryCollection, useAsyncData } from '#imports'
import { getBlogPostCategories, isBlogPostVisible, paginateBlogItems } from '../../../core'
import { useBlogSection } from './useBlogSection'

export interface BlogPostDocument extends CollectionItemBase, BlogPublication {
  path: string
  title: string
}

export interface ResolvedBlogPost extends BlogPostDocument {
  resolvedAuthors: UserProps[]
  resolvedBadge?: BadgeProps
}

export interface UseBlogPostsOptions {
  section?: MaybeRefOrGetter<string | undefined>
  page?: MaybeRefOrGetter<number | undefined>
  itemsPerPage?: MaybeRefOrGetter<number | undefined>
  category?: MaybeRefOrGetter<string | undefined>
  tag?: MaybeRefOrGetter<string | undefined>
  author?: MaybeRefOrGetter<string | undefined>
  lazy?: MaybeRefOrGetter<boolean | undefined>
}

interface AuthorRecord extends CollectionItemBase {
  username: string
  name?: string
  description?: string
  to?: string
  avatar?: UserProps['avatar']
}

export async function resolveBlogAuthors(posts: BlogPostDocument[], collection: string | false) {
  if (!collection)
    return new Map<string, UserProps>()

  const usernames = [...new Set(posts.flatMap(post => post.authors ?? []))]
  if (usernames.length === 0)
    return new Map<string, UserProps>()

  const query = queryCollection(collection as keyof Collections) as unknown as CollectionQueryBuilder<AuthorRecord>
  const authors = await query
    .where('username', 'IN', usernames)
    .select('username', 'name', 'description', 'to', 'avatar')
    .all()

  return new Map(authors.map(({ username, ...author }) => [username, author]))
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const { key: sectionKey, section } = useBlogSection(options.section)
  const page = computed(() => Math.max(1, toValue(options.page) ?? 1))
  const itemsPerPage = computed(() => Math.max(1, toValue(options.itemsPerPage) ?? section.value.itemsPerPage))
  const category = computed(() => toValue(options.category))
  const tag = computed(() => toValue(options.tag))
  const author = computed(() => toValue(options.author))

  const asyncKey = computed(() => [
    'happydesigns-blog',
    sectionKey.value,
    page.value,
    itemsPerPage.value,
    category.value ?? '',
    tag.value ?? '',
    author.value ?? '',
  ].join(':'))

  return useAsyncData(asyncKey, async () => {
    const currentSection = section.value
    const indexFields = [...new Set([
      'path',
      'published',
      'status',
      'publishedAt',
      'category',
      'categories',
      'tags',
      'authors',
      currentSection.sort.field,
    ])] as Array<keyof BlogPostDocument>
    let indexQuery = queryCollection(currentSection.collection as keyof Collections) as unknown as CollectionQueryBuilder<BlogPostDocument>
    indexQuery = indexQuery.where('published', '=', true)
    indexQuery = indexQuery.order(currentSection.sort.field as keyof BlogPostDocument & string, currentSection.sort.direction)

    const visiblePosts = (await indexQuery.select(...indexFields).all() as BlogPostDocument[])
      .filter(post => isBlogPostVisible(post))
      .filter(post => !category.value || getBlogPostCategories(post).includes(category.value))
      .filter(post => !tag.value || post.tags?.includes(tag.value))
      .filter(post => !author.value || post.authors?.includes(author.value))

    const pagination = paginateBlogItems(visiblePosts, page.value, itemsPerPage.value)
    const selectedPaths = pagination.items.map(post => post.path)
    const pageDocuments = selectedPaths.length > 0
      ? await (queryCollection(currentSection.collection as keyof Collections) as unknown as CollectionQueryBuilder<BlogPostDocument>)
          .where('path', 'IN', selectedPaths)
          .all()
      : []
    const documentsByPath = new Map(pageDocuments.map(post => [post.path, post]))
    const paginatedPosts = selectedPaths.flatMap((path) => {
      const post = documentsByPath.get(path)
      return post ? [post] : []
    })
    const authors = await resolveBlogAuthors(paginatedPosts, currentSection.features.authors && currentSection.features.authors.collection)

    const posts: ResolvedBlogPost[] = paginatedPosts.map((post) => {
      const categoryKey = currentSection.features.taxonomy
        ? getBlogPostCategories(post)[0]
        : undefined
      const categoryOptions = categoryKey && currentSection.features.taxonomy
        ? currentSection.features.taxonomy.categories[categoryKey]
        : undefined
      return {
        ...post,
        resolvedBadge: categoryKey
          ? {
              label: categoryOptions?.label ?? categoryKey,
              color: (categoryOptions?.color ?? 'primary') as BadgeProps['color'],
              icon: categoryOptions?.icon,
            }
          : undefined,
        resolvedAuthors: (post.authors ?? []).flatMap((username) => {
          const resolved = authors.get(username)
          return resolved ? [resolved] : []
        }),
      }
    })

    return {
      posts,
      page: pagination.page,
      pageCount: pagination.pageCount,
      total: pagination.total,
    }
  }, {
    lazy: toValue(options.lazy) ?? false,
    default: () => ({ posts: [] as ResolvedBlogPost[], page: 1, pageCount: 0, total: 0 }),
  })
}
