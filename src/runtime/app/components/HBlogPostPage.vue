<script setup lang="ts">
import type { ContentSurroundLink } from '@nuxt/ui'
import { computed } from 'vue'
import { createError, useHead, useSeoMeta } from '#imports'
import { joinBlogUrl } from '../../../core'
import { useBlogPost } from '../composables/useBlogPost'
import { useBlogSection } from '../composables/useBlogSection'
import { useBlogSurround } from '../composables/useBlogSurround'

const props = withDefaults(defineProps<{
  section?: string
  path?: string
  preview?: boolean
  showSurround?: boolean
}>(), {
  showSurround: true,
})

const { section } = useBlogSection(() => props.section)
const { data: post } = await useBlogPost({
  section: () => props.section,
  path: () => props.path,
  preview: () => props.preview,
})
const { data: surround } = await useBlogSurround({
  section: () => props.section,
  path: () => props.path,
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  })
}

const toc = computed(() => post.value?.body?.toc)
const showToc = computed(() => post.value?.toc !== false && Boolean(toc.value?.links?.length))
const showSurround = computed(() => props.showSurround && Boolean(surround.value?.some(Boolean)))
// UContentSurround supports empty positions at runtime, but its public prop type does not express them.
const contentSurround = computed(() => surround.value as ContentSurroundLink[] | undefined)
const canonical = computed(() => {
  const siteUrl = section.value.features.syndication && section.value.features.syndication.siteUrl
  return siteUrl && post.value?.path ? joinBlogUrl(siteUrl, post.value.path) : undefined
})

useSeoMeta({
  title: () => post.value?.title,
  description: () => post.value?.description,
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.description,
  ogType: 'article',
  ogImage: () => post.value?.image?.src,
  articlePublishedTime: () => post.value?.publishedAt
    ? new Date(post.value.publishedAt).toISOString()
    : post.value?.date ? new Date(post.value.date).toISOString() : undefined,
  articleModifiedTime: () => post.value?.updatedAt ? new Date(post.value.updatedAt).toISOString() : undefined,
})
useHead({
  link: () => canonical.value ? [{ rel: 'canonical', href: canonical.value }] : [],
})
</script>

<template>
  <UContainer v-if="post">
    <UPageHeader
      :title="post.title"
      :description="post.description"
    >
      <template #headline>
        <div class="flex flex-wrap items-center gap-3 text-muted">
          <UBadge
            v-if="post.resolvedBadge"
            v-bind="post.resolvedBadge"
            variant="subtle"
          />
          <HBlogDate
            :value="post.publishedAt ?? post.date"
            :locale="section.locale"
          />
        </div>
      </template>

      <div
        v-if="post.resolvedAuthors.length > 0"
        class="mt-4 flex flex-wrap gap-3"
      >
        <UUser
          v-for="(author, index) in post.resolvedAuthors"
          :key="String(author.to ?? author.name ?? index)"
          v-bind="author"
        />
      </div>

      <slot
        name="header"
        :post="post"
        :section="section"
      />
    </UPageHeader>

    <UPage>
      <UPageBody>
        <slot
          name="before"
          :post="post"
          :section="section"
        />
        <slot
          :post="post"
          :section="section"
        >
          <ContentRenderer
            :value="post"
            class="h-blog-content"
          />
        </slot>
        <slot
          name="after"
          :post="post"
          :section="section"
        />

        <div
          v-if="post.tags?.length"
          class="mt-12 flex flex-wrap items-center gap-2"
        >
          <span class="mr-1 text-sm font-medium text-muted">Tags</span>
          <UBadge
            v-for="tag in post.tags"
            :key="`tag:${tag}`"
            color="neutral"
            variant="outline"
          >
            {{ tag }}
          </UBadge>
        </div>

        <slot
          v-if="showSurround"
          name="surround"
          :post="post"
          :section="section"
          :surround="surround"
        >
          <UContentSurround
            :surround="contentSurround"
            class="mt-12"
          />
        </slot>
      </UPageBody>

      <template
        v-if="showToc"
        #right
      >
        <UContentToc
          :links="toc?.links"
          :title="toc?.title"
        />
      </template>
    </UPage>
  </UContainer>
</template>
