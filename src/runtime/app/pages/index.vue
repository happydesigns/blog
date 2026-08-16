<script setup lang="ts">
import { useHead, useSeoMeta } from '#imports'
import { useBlogSection } from '../composables/useBlogSection'

defineOptions({ name: 'HBlogIndexPage' })

const { section } = useBlogSection()

useSeoMeta({
  title: () => section.value.title,
  description: () => section.value.description,
})
useHead({
  link: () => section.value.feed
    ? [
        ...(section.value.feed.rss ? [{ rel: 'alternate' as const, type: 'application/rss+xml', href: section.value.feed.rss, title: `${section.value.title} RSS` }] : []),
        ...(section.value.feed.atom ? [{ rel: 'alternate' as const, type: 'application/atom+xml', href: section.value.feed.atom, title: `${section.value.title} Atom` }] : []),
      ]
    : [],
})
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="section.title"
      :description="section.description"
    />
    <UPageBody>
      <HBlogList :section="section.key" />
    </UPageBody>
  </UContainer>
</template>
