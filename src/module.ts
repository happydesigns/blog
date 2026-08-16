import type { BlogModuleOptions, NormalizedBlogConfig } from './core'
import {
  addComponentsDir,
  addImportsDir,
  addServerHandler,
  createResolver,
  defineNuxtModule,
  extendPages,
} from '@nuxt/kit'
import { normalizeBlogConfig } from './core'

export type {
  BlogAuthorOptions,
  BlogCategoryOptions,
  BlogFeedOptions,
  BlogLabels,
  BlogModuleOptions as ModuleOptions,
  BlogSectionOptions,
  BlogSectionRoutes,
  NormalizedBlogConfig,
  NormalizedBlogSection,
} from './core'

function toVueRouterPath(path: string): string {
  return path
    .replace(/\[\.\.\.(\w+)\]/g, ':$1(.*)*')
    .replace(/\[(\w+)\]/g, ':$1')
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    happydesignsBlog: NormalizedBlogConfig
  }
}

export default defineNuxtModule<BlogModuleOptions>({
  meta: {
    name: '@happydesigns/blog',
    configKey: 'blog',
    compatibility: {
      nuxt: '>=4.5.1 <6',
    },
  },
  defaults: {
    sections: {},
  },
  moduleDependencies: {
    '@nuxt/content': {
      version: '>=3.15.0 <4',
    },
    '@nuxt/ui': {
      version: '>=4.10.0 <5',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const config = normalizeBlogConfig(options)

    ;(nuxt.options.runtimeConfig.public as Record<string, unknown>).happydesignsBlog = config

    addComponentsDir({
      path: resolver.resolve('./runtime/app/components'),
      pathPrefix: false,
    })
    addImportsDir(resolver.resolve('./runtime/app/composables'))

    extendPages((pages) => {
      for (const section of Object.values(config.sections)) {
        const safeKey = section.key.replace(/[^a-z0-9-]/gi, '-')
        const pageDefinitions = [
          { kind: 'index', path: section.routes.index, file: './runtime/app/pages/index.vue' },
          { kind: 'post', path: section.routes.post, file: './runtime/app/pages/post.vue' },
          { kind: 'category', path: section.routes.category, file: './runtime/app/pages/archive.vue' },
          { kind: 'tag', path: section.routes.tag, file: './runtime/app/pages/archive.vue' },
          { kind: 'author', path: section.routes.author, file: './runtime/app/pages/archive.vue' },
        ] as const

        for (const definition of pageDefinitions) {
          if (!definition.path)
            continue
          pages.push({
            name: `happydesigns-blog-${safeKey}-${definition.kind}`,
            path: toVueRouterPath(definition.path),
            file: resolver.resolve(definition.file),
            meta: {
              blogSection: section.key,
              blogArchive: definition.kind === 'category' || definition.kind === 'tag' || definition.kind === 'author'
                ? definition.kind
                : undefined,
            },
          })
        }
      }
    })

    for (const section of Object.values(config.sections)) {
      if (!section.features.syndication)
        continue
      for (const route of [section.features.syndication.rss, section.features.syndication.atom]) {
        if (route) {
          addServerHandler({
            route,
            handler: resolver.resolve('./runtime/server/feed'),
          })
        }
      }
    }
  },
})
