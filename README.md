# @happydesigns/blog

Reusable publication capability for Nuxt Content websites.

`@happydesigns/blog` owns the complete Blog use case: publication rules,
archives, configurable routes, feeds, and a Nuxt UI based default experience.
One application can install several independent sections such as a blog, news,
or a changelog. Events, courses, and documentation remain separate domains.

The package is a Nuxt module rather than a layer because routes, server feeds,
and multiple configured sections need install-time behavior. Applications keep
their content sources and project-specific schema fields explicit in
`content.config.ts`.

## Installation

```bash
pnpm add @happydesigns/blog @nuxt/content @nuxt/ui zod
```

Define the section configuration once:

```ts
// blog.config.ts
import { defineBlogConfig } from '@happydesigns/blog/core'

export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      title: 'Blog',
      features: {
        list: { previewImages: true },
        authors: { collection: 'user' },
        taxonomy: {
          categories: {
            News: { label: 'News', color: 'primary' },
          },
        },
        syndication: { rss: '/blog/rss.xml', atom: false },
      },
    },
    news: {
      collection: 'news',
      basePath: '/news',
      title: 'News',
    },
  },
})
```

Install the module:

```ts
// nuxt.config.ts
import blog from './blog.config'

export default defineNuxtConfig({
  modules: [
    ['@happydesigns/blog', blog],
  ],
})
```

Materialize the consumer-owned collections. Section keys are used here, while
the returned object is keyed by each configured collection name:

```ts
// content.config.ts
import { defineBlogCollections } from '@happydesigns/blog/content'
import { defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import blog from './blog.config'

export default defineContentConfig({
  collections: defineBlogCollections(blog, {
    blog: {
      source: 'blog/**/*.{md,yaml}',
      schema: {
        campaign: z.string().optional(),
      },
    },
    news: {
      source: 'news/**/*.{md,yaml}',
    },
  }),
})
```

`defineBlogCollection` is also exported for applications that prefer to define
one collection at a time.

### Compose schemas with Nuxt Variants

Blog provides publication behavior, while the consuming application remains
free to compose layout features and their fields through Nuxt Variants. Pass
that resolved object schema as `baseSchema`; Blog adds only its publication
contract and any project extension on top:

```ts
import { articleSchema } from './content/variants'

defineBlogCollections(blog, {
  blog: {
    source: 'blog/**/*.{md,yaml}',
    baseSchema: articleSchema,
    schema: {
      campaign: z.string().optional(),
    },
  },
})
```

This keeps the Nuxt Variants graph authoritative for shared page features and
lets Blog remain an installable preset for queries, routes, syndication, and a
default Nuxt UI experience.

## Defaults and routes

Every section receives these default routes below its `basePath`:

- index: `/blog`
- post: `/blog/[...slug]`
- category archive: `/blog/category/:category`
- tag archive: `/blog/tag/:tag`
- author archive: `/blog/author/:author`
- RSS: `/blog/rss.xml`
- Atom: `/blog/atom.xml`

Each route accepts an explicit path or `false`. This lets an application retain
existing URLs or own selected pages itself:

```ts
defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      routes: {
        index: false,
        post: '/blog/article/[...slug]',
      },
      features: {
        syndication: {
          rss: '/blog/rss.xml',
          atom: false,
        },
      },
    },
  },
})
```

Module pages are optional. Custom pages can use the auto-imported
`HBlogList`, `HBlogPostPage`, `useBlogPosts`, and `useBlogPost` APIs.

### List pagination

Set `itemsPerPage` on a section to define its default page size. `HBlogList`
keeps the current page in the `page` query parameter, resets it when the
category changes, and clamps stale or invalid pages to the available range.
Individual lists can override `itemsPerPage` or hide the controls with
`showPagination="false"`, which is useful for a short latest-posts preview.

## Publication rules

The schema preserves the established `published` Boolean and adds an optional
status model:

- `published: false` always hides a document.
- `status: draft` hides a document.
- `status: scheduled` becomes visible when `publishedAt` is reached.
- `status: published` is visible unless `publishedAt` is still in the future.
- Legacy documents with `published: true` and no status remain visible.

Public pages and feeds use the same rule. Scheduled publication on a statically
generated site still requires a new build at or after the publication time.
Preview access is deliberately not inferred from a query parameter.

## Development

```bash
pnpm install
pnpm dev:prepare
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm dev:build
```

See `ARCHITECTURE.md` for ownership, Comark readiness, extension, and removal
boundaries.

