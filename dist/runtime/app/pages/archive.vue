<script setup>
import { computed } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import { useBlogSection } from "../composables/useBlogSection";
defineOptions({ name: "HBlogArchivePage" });
const route = useRoute();
const { section } = useBlogSection();
const archive = computed(() => typeof route.meta.blogArchive === "string" ? route.meta.blogArchive : void 0);
const value = computed(() => {
  if (!archive.value)
    return void 0;
  const parameter = route.params[archive.value];
  return Array.isArray(parameter) ? parameter[0] : parameter;
});
const title = computed(() => value.value ? `${section.value.title}: ${value.value}` : section.value.title);
useSeoMeta({ title });
</script>

<template>
  <UContainer>
    <UPageHeader :title="title" />
    <UPageBody>
      <HBlogList
        :section="section.key"
        :category="archive === 'category' ? value : void 0"
        :tag="archive === 'tag' ? value : void 0"
        :author="archive === 'author' ? value : void 0"
        :show-categories="archive !== 'category'"
      />
    </UPageBody>
  </UContainer>
</template>
