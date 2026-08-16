<script setup lang="ts">
defineOptions({
  name: 'BlogPlaygroundIndex',
})

useSeoMeta({
  title: 'happydesigns/blog Playground',
  description: 'Explore a configurable publication capability for Nuxt Content.',
})

const heroLinks = [
  {
    label: 'View the blog',
    to: '/blog',
    icon: 'i-lucide-arrow-right',
    trailing: true,
  },
  {
    label: 'View release notes',
    to: '/news',
    color: 'neutral' as const,
    variant: 'outline' as const,
  },
]

const features = [
  {
    title: 'Multiple publications',
    description: 'Run a blog, news section or release notes from the same capability with independent routes and configuration.',
  },
  {
    title: 'Composable schemas',
    description: 'Keep the content model in your application and add only the fields your product and workflow require.',
  },
  {
    title: 'Useful defaults',
    description: 'Start with list and detail routes, taxonomies, authors and feeds, then replace the UI when needed.',
  },
]
</script>

<template>
  <div>
    <UPageHero
      headline="Composable publishing"
      title="A configurable blog for Nuxt Content."
      description="Add publication routes, filters, authors and feeds while your application keeps control of its content model and visual language."
      :links="heroLinks"
      orientation="horizontal"
      class="border-b border-default"
    >
      <BlogHeroPreview />
    </UPageHero>

    <UPageSection
      headline="Live example"
      title="Latest posts"
      description="The same list component is available to every application that uses the capability."
      :links="[{
        label: 'View all posts',
        to: '/blog',
        color: 'neutral',
        variant: 'outline',
        trailingIcon: 'i-lucide-arrow-right',
      }]"
    >
      <template #body>
        <HBlogList
          section="blog"
          :items-per-page="3"
          :show-categories="false"
        />
      </template>
    </UPageSection>

    <UPageSection
      headline="Included"
      title="Publication behavior without a fixed product."
      description="Use the defaults as a complete starting point or compose the underlying data and behavior into your own interface."
      :features="features"
      class="border-t border-default bg-elevated/50"
    />
  </div>
</template>
