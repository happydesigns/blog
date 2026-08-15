import type { MaybeRefOrGetter } from 'vue';
import type { ResolvedBlogPost } from './useBlogPosts.js';
export interface UseBlogPostOptions {
    section?: MaybeRefOrGetter<string | undefined>;
    path?: MaybeRefOrGetter<string | undefined>;
    preview?: MaybeRefOrGetter<boolean | undefined>;
}
export declare function useBlogPost(options?: UseBlogPostOptions): import("#app").AsyncData<ResolvedBlogPost | null | undefined, import("#app").NuxtError<unknown> | undefined>;
