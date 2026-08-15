import type { CollectionItemBase } from '@nuxt/content';
import type { BadgeProps, UserProps } from '@nuxt/ui';
import type { MaybeRefOrGetter } from 'vue';
import type { BlogPublication } from '../../../core.js';
export interface BlogPostDocument extends CollectionItemBase, BlogPublication {
    path: string;
    title: string;
}
export interface ResolvedBlogPost extends BlogPostDocument {
    resolvedAuthors: UserProps[];
    resolvedBadge?: BadgeProps;
}
export interface UseBlogPostsOptions {
    section?: MaybeRefOrGetter<string | undefined>;
    page?: MaybeRefOrGetter<number | undefined>;
    itemsPerPage?: MaybeRefOrGetter<number | undefined>;
    category?: MaybeRefOrGetter<string | undefined>;
    tag?: MaybeRefOrGetter<string | undefined>;
    author?: MaybeRefOrGetter<string | undefined>;
    lazy?: MaybeRefOrGetter<boolean | undefined>;
}
export declare function resolveBlogAuthors(posts: BlogPostDocument[], collection: string | false): Promise<Map<string, UserProps> | Map<string, {
    to?: string | undefined;
    description?: string | undefined;
    name?: string | undefined;
    avatar?: (Omit<import("@nuxt/ui").AvatarProps, "size"> & {
        [key: string]: any;
    }) | undefined;
}>>;
export declare function useBlogPosts(options?: UseBlogPostsOptions): import("#app").AsyncData<{
    posts: ResolvedBlogPost[];
    total: number;
} | {
    posts: ResolvedBlogPost[];
    total: number;
}, import("#app").NuxtError<unknown> | undefined>;
