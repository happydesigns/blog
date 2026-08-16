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
          <span class="grid size-8 place-items-center rounded-lg bg-primary text-inverted shadow-sm shadow-primary/30">
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              aria-hidden="true"
            >
              <path d="M15 18h-5m8-4h-8m-6 8h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
              <rect
                width="8"
                height="4"
                x="10"
                y="6"
                rx="1"
              />
            </svg>
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
