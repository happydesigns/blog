---
title: A publication capability, not a page template
description: Why Blog owns routes, feeds, and publication semantics.
date: 2026-08-15
published: true
image:
  src: /images/blog-architecture.svg
  alt: Abstract layers forming a publication system
  width: 1200
  height: 675
authors:
  - jan
category: Architecture
tags:
  - nuxt
  - capabilities
campaign: module-playground
---

The Blog capability keeps publication behavior outside the neutral UI foundation.

Applications can adopt useful routes, queries, feeds and default components without surrendering ownership of their schemas or product-specific layouts.

## A contract around publication

Blog owns the parts that need to agree across every publishing surface: whether a document is public, where it can be reached, how it appears in an archive, and which entries belong in a feed.

::note
A scheduled article is hidden from lists, detail routes, and feeds until the same publication rule considers it visible.
::

The application still owns the subject of the content. A club report can add a tournament reference, a product journal can add a release channel, and a restaurant can add a location without changing Blog's core.

## One configuration, several sections

Each section receives its own route and feature configuration while sharing the same deterministic publication rules.

```ts
export default defineBlogConfig({
  sections: {
    blog: {
      collection: 'article',
      basePath: '/blog',
      features: {
        taxonomy: { categories },
        syndication: { rss: '/blog/rss.xml' },
      },
    },
    news: {
      collection: 'news',
      basePath: '/news',
    },
  },
})
```

## Ownership stays visible

| Concern | Owner |
| --- | --- |
| Publication status, archives, routes, and feeds | Blog capability |
| Content fields and editorial workflow | Consuming application |
| Prose primitives and visual defaults | Nuxt UI and happydesigns/ui |
| Brand, deployment, and intentional overrides | Consuming project |

This boundary lets a project start with the default pages and later replace them with custom routes using the same composables. Explore the independent [release notes section](/news) to see the same capability configured a second time.

