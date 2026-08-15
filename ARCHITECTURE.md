# Architecture

## Ownership

`@happydesigns/blog` owns publication semantics, section configuration,
archives, feeds, Blog routes, and Blog-specific composition. Nuxt UI owns the
visual primitives. `happydesigns/ui` may provide neutral content primitives but
must not become the runtime wrapper for this capability.

Applications own content files, collection sources, optional schema fields,
brand presentation, deployment, preview authorization, and intentional route
overrides.

## Package boundaries

- `@happydesigns/blog/core` contains deterministic types, configuration
  normalization, visibility rules, and URL helpers. It imports no framework.
- `@happydesigns/blog/content` adapts the contract to Nuxt Content and Zod.
- The package root is the Nuxt module. Its runtime registers prefixed
  components, composables, optional pages, and feeds.

These are subpath exports of one package. A second package is justified only by
a real non-Nuxt consumer.

## Content and rendering

Markdown plus typed metadata is canonical. Nuxt Content is the first storage and
rendering adapter. The core never exposes an MDC AST as a domain type; runtime
components receive the raw document only at the renderer boundary. A future
Comark adapter can therefore provide a document body without changing status,
taxonomy, route, pagination, or feed rules.

## Extension and removal

Consumer schemas extend the base contract through `defineBlogCollection` or
`defineBlogCollections`. Unknown consumer fields remain on queried documents
and are exposed to component slots.

The module can be removed by removing its dependency and module registration.
Content remains normal Nuxt Content data. Applications that use module-owned
routes must replace those routes before uninstalling; applications with custom
pages can continue using their content directly.

