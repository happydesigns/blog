<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useSeoMeta } from '#imports'
import { useBlogSection } from '../composables/useBlogSection'

defineOptions({ name: 'HBlogArchivePage' })

const route = useRoute()
const { section } = useBlogSection()
const archive = computed(() => typeof route.meta.blogArchive === 'string' ? route.meta.blogArchive : undefined)
const value = computed(() => {
  if (!archive.value)
    return undefined
  const parameter = route.params[archive.value]
  return Array.isArray(parameter) ? parameter[0] : parameter
})
const title = computed(() => value.value ? `${section.value.title}: ${value.value}` : section.value.title)

useSeoMeta({ title })
</script>

<template>
  <UContainer>
    <UPageHeader :title="title" />
    <UPageBody>
      <HBlogList
        :section="section.key"
        :category="archive === 'category' ? value : undefined"
        :tag="archive === 'tag' ? value : undefined"
        :author="archive === 'author' ? value : undefined"
        :show-categories="archive !== 'category'"
      />
    </UPageBody>
  </UContainer>
</template>
