<script setup lang="ts">
const navigation = [
  { label: 'Overview', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: 'News', to: '/news' },
]
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-default text-highlighted">
      <header class="sticky top-0 z-40 border-b border-default bg-default/85 backdrop-blur-xl">
        <UContainer class="flex h-16 items-center justify-between gap-6">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 font-semibold tracking-tight"
          >
            <span class="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-inverted shadow-sm shadow-primary/30">
              h
            </span>
            <span class="hidden sm:inline">happydesigns/blog</span>
          </NuxtLink>

          <nav
            class="flex items-center gap-1"
            aria-label="Playground navigation"
          >
            <UButton
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              :label="item.label"
              color="neutral"
              variant="ghost"
            />
          </nav>
        </UContainer>
      </header>

      <main>
        <NuxtPage />
      </main>

      <footer class="mt-24 border-t border-default">
        <UContainer class="flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>A configurable publication capability for Nuxt Content.</p>
          <p>Core · Content schema · Nuxt integration</p>
        </UContainer>
      </footer>
    </div>
  </UApp>
</template>
