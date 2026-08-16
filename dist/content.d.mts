import * as _nuxt_content from '@nuxt/content';
import { CollectionIndex } from '@nuxt/content';
import { ZodRawShape, z } from 'zod';
import { BlogModuleOptions } from './core.mjs';

type BlogCollectionSource = string | {
    include: string;
    exclude?: string[];
    prefix?: string;
};
interface DefineBlogCollectionOptions {
    source: BlogCollectionSource;
    schema?: ZodRawShape;
    indexes?: CollectionIndex[];
}
declare const blogPostSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodDate>;
    publishedAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
    published: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<{
        published: "published";
        draft: "draft";
        scheduled: "scheduled";
    }>>;
    authors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    category: z.ZodOptional<z.ZodString>;
    categories: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    image: z.ZodOptional<z.ZodObject<{
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
    header: z.ZodOptional<z.ZodObject<{}, z.core.$strip> & {
        editor: (opts: _nuxt_content.EditorOptions) => z.ZodObject<{}, z.core.$strip> & /*elided*/ any;
        markdown: () => z.ZodObject<{}, z.core.$strip> & /*elided*/ any;
        inherit: (componentPath: string) => z.ZodObject<{}, z.core.$strip> & /*elided*/ any;
    }>;
    toc: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const blogCollectionIndexes: {
    columns: string[];
}[];
declare function defineBlogCollection(options: DefineBlogCollectionOptions): _nuxt_content.DefinedCollection;
declare function defineBlogCollections<const T extends BlogModuleOptions>(config: T, definitions: Record<string, DefineBlogCollectionOptions>): Record<string, _nuxt_content.DefinedCollection>;

export { blogCollectionIndexes, blogPostSchema, defineBlogCollection, defineBlogCollections };
export type { BlogCollectionSource, DefineBlogCollectionOptions };
