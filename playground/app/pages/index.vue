<script setup lang="ts">
defineOptions({
  name: 'BlogPlaygroundIndex',
})

useSeoMeta({
  title: 'happydesigns/blog Playground',
  description: 'Explore a configurable publication capability for Nuxt Content.',
})

const features = [
  {
    eyebrow: 'One capability',
    title: 'Multiple publications',
    description: 'Blog posts and release notes share one foundation while keeping independent routes and configuration.',
  },
  {
    eyebrow: 'Consumer-owned',
    title: 'Composable schemas',
    description: 'Applications keep their content model and add exactly the fields their layouts and workflows require.',
  },
  {
    eyebrow: 'Useful defaults',
    title: 'Routes, filters and feeds',
    description: 'Index pages, detail routes, taxonomies, authors and syndication work together out of the box.',
  },
]
</script>

<template>
  <div>
    <section class="relative overflow-hidden border-b border-default">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,color-mix(in_oklab,var(--ui-primary)_18%,transparent),transparent_34%),radial-gradient(circle_at_15%_80%,color-mix(in_oklab,var(--ui-info)_12%,transparent),transparent_30%)]" />
      <UContainer class="relative py-24 sm:py-32">
        <div class="max-w-3xl">
          <UBadge
            color="primary"
            variant="subtle"
            label="Nuxt Content capability"
          />
          <h1 class="mt-7 text-5xl font-black tracking-tight text-balance sm:text-7xl">
            Publish once.<br>
            <span class="text-primary">Shape it your way.</span>
          </h1>
          <p class="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            happydesigns/blog provides the publication behavior. Your application owns the content model, visual language and product-specific experience.
          </p>
          <div class="mt-10 flex flex-wrap gap-3">
            <UButton
              to="/blog"
              size="xl"
              label="Explore the blog"
            />
            <UButton
              to="/news"
              size="xl"
              color="neutral"
              variant="outline"
              label="View release notes"
            />
          </div>
        </div>
      </UContainer>
    </section>

    <UContainer>
      <section class="grid gap-px overflow-hidden rounded-2xl border border-default bg-default sm:grid-cols-3 -translate-y-7 shadow-xl shadow-black/5">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="bg-elevated p-7 sm:p-8"
        >
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {{ feature.eyebrow }}
          </p>
          <h2 class="mt-3 text-xl font-bold">
            {{ feature.title }}
          </h2>
          <p class="mt-3 leading-7 text-muted">
            {{ feature.description }}
          </p>
        </article>
      </section>

      <section class="py-16 sm:py-24">
        <div class="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-primary">
              Live capability output
            </p>
            <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Latest stories
            </h2>
            <p class="mt-3 max-w-2xl text-muted">
              These cards are rendered by the same configurable list component a consuming application receives.
            </p>
          </div>
          <UButton
            to="/blog"
            color="neutral"
            variant="outline"
            label="Browse all posts"
          />
        </div>

        <HBlogList
          section="blog"
          :items-per-page="3"
          :show-categories="false"
        />
      </section>

      <section class="grid gap-8 rounded-3xl bg-elevated p-8 sm:p-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <UBadge
            color="neutral"
            variant="outline"
            label="Configuration over convention"
          />
          <h2 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Start with defaults. Keep the escape hatches.
          </h2>
          <p class="mt-4 max-w-xl leading-7 text-muted">
            Each publication section chooses its own collection, base path, taxonomy, authors, list behavior and feeds. Slots and composables remain available when the default UI is not enough.
          </p>
        </div>
        <pre class="overflow-x-auto rounded-2xl border border-default bg-default p-6 text-sm leading-7 text-muted"><code>sections: {
  blog: {
    collection: 'article',
    basePath: '/blog',
    features: {
      authors: { collection: 'author' },
      taxonomy: { categories }
    }
  }
}</code></pre>
      </section>
    </UContainer>
  </div>
</template>
