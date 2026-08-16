import type { MaybeRefOrGetter } from 'vue'
import type { NormalizedBlogConfig, NormalizedBlogSection } from '../../../core'
import { computed, toValue } from 'vue'
import { createError, useRoute, useRuntimeConfig } from '#imports'

export function useBlogSection(sectionKey?: MaybeRefOrGetter<string | undefined>) {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const sections = (runtimeConfig.public.happydesignsBlog as unknown as NormalizedBlogConfig).sections

  const key = computed(() => {
    const requested = toValue(sectionKey)
    const routeSection = typeof route.meta.blogSection === 'string' ? route.meta.blogSection : undefined
    return requested ?? routeSection ?? Object.keys(sections)[0]
  })

  const section = computed<NormalizedBlogSection>(() => {
    const resolved = key.value ? sections[key.value] : undefined
    if (!resolved) {
      throw createError({
        statusCode: 500,
        statusMessage: `[happydesigns/blog] Unknown section "${key.value ?? ''}".`,
      })
    }
    return resolved
  })

  return { key, section }
}
