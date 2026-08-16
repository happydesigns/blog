<script setup lang="ts">
import { computed } from 'vue'
import { createError, useHead, useSeoMeta } from '#imports'
import { getBlogPostCategories, joinBlogUrl } from '../../../core'
import { useBlogPost } from '../composables/useBlogPost'
import { useBlogSection } from '../composables/useBlogSection'

const props = defineProps<{
  section?: string
  path?: string
  preview?: boolean
}>()

const { section } = useBlogSection(() => props.section)
const { data: post } = await useBlogPost({
  section: () => props.section,
  path: () => props.path,
  preview: () => props.preview,
})

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  })
}

const categories = computed(() => post.value ? getBlogPostCategories(post.value) : [])
const canonical = computed(() => {
  const siteUrl = section.value.feed && section.value.feed.siteUrl
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
          v-if="categories.length > 0 || post.tags?.length"
          class="mt-12 flex flex-wrap gap-2"
        >
          <UBadge
            v-for="category in categories"
            :key="`category:${category}`"
            color="neutral"
            variant="subtle"
          >
            {{ section.categories[category]?.label ?? category }}
          </UBadge>
          <UBadge
            v-for="tag in post.tags"
            :key="`tag:${tag}`"
            color="neutral"
            variant="outline"
          >
            {{ tag }}
          </UBadge>
        </div>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
