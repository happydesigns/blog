<script setup lang="ts">
const navigation = [
  { label: 'Overview', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'News', to: '/news' },
]
</script>

<template>
  <UApp>
    <HSiteHeader
      :items="navigation"
      to="/"
      title="happydesigns/blog"
      :menu="{
        title: 'Playground navigation',
        description: 'Explore the Blog capability and its publication sections.',
      }"
    >
      <template #title>
        <span
          class="group flex items-center gap-2.5"
          aria-label="happydesigns/blog home"
        >
          <span class="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-inverted shadow-sm shadow-primary/30">
            h
          </span>
          <span class="font-semibold tracking-tight text-highlighted">
            happydesigns<span class="text-primary">/blog</span>
          </span>
        </span>
      </template>

      <template #right>
        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
      </template>
    </HSiteHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter :ui="{ root: 'border-t border-default' }">
      <template #left>
        <HFooterCopyright
          copyright-holder="happydesigns"
          copyright-homepage="/"
        />
      </template>

      <template #right>
        <p class="text-sm text-muted">
          Core · Content schema · Nuxt integration
        </p>
      </template>
    </UFooter>
  </UApp>
</template>
