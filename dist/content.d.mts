import * as _nuxt_content from '@nuxt/content';
import { CollectionIndex } from '@nuxt/content';
import { ZodObject, ZodRawShape, z } from 'zod';
import { BlogModuleOptions } from './core.mjs';

type BlogCollectionSource = string | {
    include: string;
    exclude?: string[];
    prefix?: string;
};
interface DefineBlogCollectionOptions {
    source: BlogCollectionSource;
    /** A schema composed by Nuxt Variants or another consumer-owned feature graph. */
    baseSchema?: ZodObject<ZodRawShape>;
    schema?: ZodRawShape;
    indexes?: CollectionIndex[];
}
declare const blogPublicationSchema: ZodObject<{
    date: z.ZodOptional<z.ZodDate>;
    publishedAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    published: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        scheduled: "scheduled";
    }>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const blogPostSchema: ZodObject<{
    date: z.ZodOptional<z.ZodDate>;
    publishedAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    published: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        scheduled: "scheduled";
    }>>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    authors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<ZodObject<{
        src: z.ZodString & {
            editor: (opts: _nuxt_content.EditorOptions) => z.ZodString & /*elided*/ any;
            markdown: () => z.ZodString & /*elided*/ any;
            inherit: (componentPath: string) => z.ZodString & /*elided*/ any;
        };
        alt: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        position: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    header: z.ZodOptional<ZodObject<{}, z.core.$strip> & {
        editor: (opts: _nuxt_content.EditorOptions) => ZodObject<{}, z.core.$strip> & /*elided*/ any;
        markdown: () => ZodObject<{}, z.core.$strip> & /*elided*/ any;
        inherit: (componentPath: string) => ZodObject<{}, z.core.$strip> & /*elided*/ any;
    }>;
    toc: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const blogCollectionIndexes: {
    columns: string[];
}[];
declare function createBlogCollectionSchema(options?: Pick<DefineBlogCollectionOptions, 'baseSchema' | 'schema'>): ZodObject<{
    [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strip> | ZodObject<{
    [x: string]: z.core.$ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
}, z.core.$strip>;
declare function defineBlogCollection(options: DefineBlogCollectionOptions): _nuxt_content.DefinedCollection;
declare function defineBlogCollections<const T extends BlogModuleOptions>(config: T, definitions: Record<string, DefineBlogCollectionOptions>): Record<string, _nuxt_content.DefinedCollection>;

export { blogCollectionIndexes, blogPostSchema, blogPublicationSchema, createBlogCollectionSchema, defineBlogCollection, defineBlogCollections };
export type { BlogCollectionSource, DefineBlogCollectionOptions };
