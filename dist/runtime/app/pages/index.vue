<script setup>
import { useHead, useSeoMeta } from "#imports";
import { useBlogSection } from "../composables/useBlogSection";
defineOptions({ name: "HBlogIndexPage" });
const { section } = useBlogSection();
useSeoMeta({
  title: () => section.value.title,
  description: () => section.value.description
});
useHead({
  link: () => section.value.features.syndication ? [
    ...section.value.features.syndication.rss ? [{ rel: "alternate", type: "application/rss+xml", href: section.value.features.syndication.rss, title: `${section.value.title} RSS` }] : [],
    ...section.value.features.syndication.atom ? [{ rel: "alternate", type: "application/atom+xml", href: section.value.features.syndication.atom, title: `${section.value.title} Atom` }] : []
  ] : []
});
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
