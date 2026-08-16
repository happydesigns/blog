<script setup lang="ts">
const authors = [
  {
    name: 'Jan',
    description: 'Product and systems design',
    avatar: {
      src: '/images/avatar-jan.svg',
      alt: 'Jan',
    },
  },
]
</script>

<template>
  <UBlogPost
    title="A publication capability, not a page template"
    description="Why Blog owns routes, feeds and publication semantics."
    date="2026-08-15"
    :badge="{
      label: 'Architecture',
      color: 'primary',
      variant: 'subtle',
    }"
    :image="{
      src: '/images/blog-architecture.svg',
      alt: 'Abstract layers forming a publication system',
      width: 1200,
      height: 675,
    }"
    :authors="authors"
    to="/blog/architecture"
    variant="subtle"
    class="w-full max-w-xl justify-self-end"
  />
</template>
