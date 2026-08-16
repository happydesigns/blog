import type { CollectionIndex } from '@nuxt/content'
import type { ZodObject, ZodRawShape } from 'zod'
import type { BlogModuleOptions } from './core'
import { defineCollection, property } from '@nuxt/content'
import { z } from 'zod'
import { normalizeBlogConfig } from './core'

export type BlogCollectionSource = string | {
  include: string
  exclude?: string[]
  prefix?: string
}

export interface DefineBlogCollectionOptions {
  source: BlogCollectionSource
  /** A schema composed by Nuxt Variants or another consumer-owned feature graph. */
  baseSchema?: ZodObject<ZodRawShape>
  schema?: ZodRawShape
  indexes?: CollectionIndex[]
}

export const blogPublicationSchema = z.object({
  date: z.date().optional(),
  publishedAt: z.date().optional(),
  updatedAt: z.date().optional(),
  published: z.boolean().default(true),
  status: z.enum(['draft', 'scheduled', 'published']).optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export const blogPostSchema = blogPublicationSchema.extend({
  authors: z.array(z.string()).optional(),
  category: z.string().optional(),
  image: z.object({
    src: property(z.string()).editor({ input: 'media' }),
    alt: z.string().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    position: z.string().optional(),
  }).optional(),
  header: property(z.object({})).inherit('@nuxt/ui/components/PageHeader.vue').optional(),
  toc: z.boolean().default(true),
})

export const blogCollectionIndexes = [
  { columns: ['published', 'date'] },
  { columns: ['published', 'category', 'date'] },
  { columns: ['status', 'publishedAt'] },
] satisfies CollectionIndex[]

export function createBlogCollectionSchema(options: Pick<DefineBlogCollectionOptions, 'baseSchema' | 'schema'> = {}) {
  const baseSchema = options.baseSchema
    ? options.baseSchema.extend(blogPublicationSchema.shape)
    : blogPostSchema

  return baseSchema.extend(options.schema ?? {})
}

export function defineBlogCollection(options: DefineBlogCollectionOptions) {
  return defineCollection({
    type: 'page',
    source: options.source,
    schema: createBlogCollectionSchema(options),
    indexes: options.indexes ?? blogCollectionIndexes,
  })
}

export function defineBlogCollections<const T extends BlogModuleOptions>(
  config: T,
  definitions: Record<string, DefineBlogCollectionOptions>,
) {
  const normalized = normalizeBlogConfig(config)
  const collections: Record<string, ReturnType<typeof defineBlogCollection>> = {}

  for (const [sectionKey, section] of Object.entries(normalized.sections)) {
    const definition = definitions[sectionKey]
    if (!definition)
      throw new Error(`[happydesigns/blog] Missing collection definition for section "${sectionKey}".`)
    collections[section.collection] = defineBlogCollection(definition)
  }

  const unknownDefinitions = Object.keys(definitions).filter(key => !normalized.sections[key])
  if (unknownDefinitions.length > 0)
    throw new Error(`[happydesigns/blog] Unknown section definitions: ${unknownDefinitions.join(', ')}.`)

  return collections
}
