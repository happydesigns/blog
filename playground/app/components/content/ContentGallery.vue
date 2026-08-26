<script setup lang="ts">
interface GalleryItem {
  src: string
  alt: string
  caption?: string
}

defineProps<{
  items: GalleryItem[]
}>()
</script>

<template>
  <div class="not-prose my-8 grid gap-4 sm:grid-cols-2">
    <figure
      v-for="item in items"
      :key="item.src"
      class="overflow-hidden rounded-lg border border-default bg-elevated"
    >
      <img
        :src="item.src"
        :alt="item.alt"
        class="aspect-video w-full object-cover"
        loading="lazy"
      >
      <figcaption
        v-if="item.caption"
        class="px-4 py-3 text-sm text-muted"
      >
        {{ item.caption }}
      </figcaption>
    </figure>
  </div>
</template>
