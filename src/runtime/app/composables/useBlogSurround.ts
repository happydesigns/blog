import type { CollectionQueryBuilder, Collections } from '@nuxt/content'
import type { ContentSurroundLink } from '@nuxt/ui'
import type { MaybeRefOrGetter } from 'vue'
import type { BlogPostDocument } from './useBlogPosts'
import { computed, toValue } from 'vue'
import { queryCollection, useAsyncData, useRoute } from '#imports'
import { isBlogPostVisible } from '../../../core'
import { useBlogSection } from './useBlogSection'

export interface UseBlogSurroundOptions {
  section?: MaybeRefOrGetter<string | undefined>
  path?: MaybeRefOrGetter<string | undefined>
}

function toSurroundLink(post: BlogPostDocument | undefined): ContentSurroundLink | null {
  if (!post)
    return null

  return {
    path: post.path,
    title: post.title,
    description: post.description,
  }
}

export function useBlogSurround(options: UseBlogSurroundOptions = {}) {
  const route = useRoute()
  const { key: sectionKey, section } = useBlogSection(options.section)
  const path = computed(() => toValue(options.path) ?? route.path)
  const asyncKey = computed(() => `happydesigns-blog:${sectionKey.value}:surround:${path.value}`)

  return useAsyncData(asyncKey, async () => {
    const currentSection = section.value
    const fields = [...new Set([
      'path',
      'title',
      'description',
      'published',
      'status',
      'publishedAt',
      currentSection.sort.field,
    ])] as Array<keyof BlogPostDocument>
    let query = queryCollection(currentSection.collection as keyof Collections) as unknown as CollectionQueryBuilder<BlogPostDocument>
    query = query.where('published', '=', true)
    query = query.order(currentSection.sort.field as keyof BlogPostDocument & string, currentSection.sort.direction)

    const visiblePosts = (await query.select(...fields).all() as BlogPostDocument[])
      .filter(post => isBlogPostVisible(post))
    const currentIndex = visiblePosts.findIndex(post => post.path === path.value)

    if (currentIndex === -1)
      return [null, null]

    return [
      toSurroundLink(visiblePosts[currentIndex - 1]),
      toSurroundLink(visiblePosts[currentIndex + 1]),
    ]
  })
}
