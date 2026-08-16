import type { CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { MaybeRefOrGetter } from 'vue'
import type { BadgeProps } from '@nuxt/ui'
import type { BlogPostDocument, ResolvedBlogPost } from './useBlogPosts'
import { computed, toValue } from 'vue'
import { queryCollection, useAsyncData, useRoute } from '#imports'
import { getBlogPostCategories, isBlogPostVisible } from '../../../core'
import { useBlogSection } from './useBlogSection'
import { resolveBlogAuthors } from './useBlogPosts'

export interface UseBlogPostOptions {
  section?: MaybeRefOrGetter<string | undefined>
  path?: MaybeRefOrGetter<string | undefined>
  preview?: MaybeRefOrGetter<boolean | undefined>
}

export function useBlogPost(options: UseBlogPostOptions = {}) {
  const route = useRoute()
  const { key: sectionKey, section } = useBlogSection(options.section)
  const path = computed(() => toValue(options.path) ?? route.path)
  const preview = computed(() => toValue(options.preview) ?? false)
  const asyncKey = computed(() => `happydesigns-blog:${sectionKey.value}:post:${path.value}:${preview.value}`)

  return useAsyncData(asyncKey, async () => {
    const query = queryCollection(section.value.collection as keyof Collections) as unknown as CollectionQueryBuilder<BlogPostDocument>
    const post = await query.path(path.value).first()
    if (!post)
      return null
    if (!preview.value && !isBlogPostVisible(post))
      return null
    const authors = await resolveBlogAuthors([post], section.value.features.authors && section.value.features.authors.collection)
    const categoryKey = section.value.features.taxonomy
      ? getBlogPostCategories(post)[0]
      : undefined
    const categoryOptions = categoryKey && section.value.features.taxonomy
      ? section.value.features.taxonomy.categories[categoryKey]
      : undefined
    const resolved: ResolvedBlogPost = {
      ...post,
      resolvedBadge: categoryKey
        ? {
            label: categoryOptions?.label ?? categoryKey,
            color: (categoryOptions?.color ?? 'primary') as BadgeProps['color'],
            icon: categoryOptions?.icon,
          }
        : undefined,
      resolvedAuthors: (post.authors ?? []).flatMap((username) => {
        const author = authors.get(username)
        return author ? [author] : []
      }),
    }
    return resolved
  })
}
