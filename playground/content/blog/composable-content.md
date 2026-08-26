---
title: Content models should compose, not compete
description: How consumer-owned schemas and reusable publication behavior can reinforce each other.
date: 2026-08-14
published: true
authors:
  - maya
category: Product
tags:
  - content
  - nuxt-variants
image:
  src: /images/blog-content.svg
  alt: Colorful content blocks arranged into a flexible composition
  width: 1200
  height: 675
---

A reusable capability should make common setups fast without forcing every product into the same content model.

The application remains free to compose fields for campaigns, events, courses or any future publication-like use case.

## Start with the shared publication fields

Every article can use dates, authors, categories, tags, preview images, and publication state. Those fields are enough for Blog to build routes, filters, cards, and feeds.

Project fields are layered on top rather than squeezed into a universal schema:

::card-group
  ::card{title="Community report"}
  Add a tournament or event reference that connects editorial content to a project-owned collection.
  ::
  ::card{title="Campaign story"}
  Add campaign and audience fields without teaching the publication core about marketing workflows.
  ::
  ::card{title="Course update"}
  Connect a post to a lesson or cohort while Course remains the owner of learning behavior.
  ::
::

## Compose instead of duplicate

```ts
defineBlogCollections(blog, {
  blog: {
    source: 'blog/**/*.md',
    baseSchema: articleVariantSchema,
    schema: {
      campaign: z.string().optional(),
    },
  },
})
```

The resolved Nuxt Variants schema can provide reusable layout fields. Blog then adds only its publication contract and the local extension.

> A consumer-owned field remains available to custom cards and page slots because queried documents are not reduced to a Blog-only view model.

That also keeps a future content adapter possible: publication rules do not depend on the shape of an MDC syntax tree.
