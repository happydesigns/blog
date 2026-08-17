import type { ContentSurroundLink } from '@nuxt/ui';
import type { MaybeRefOrGetter } from 'vue';
export interface UseBlogSurroundOptions {
    section?: MaybeRefOrGetter<string | undefined>;
    path?: MaybeRefOrGetter<string | undefined>;
}
export declare function useBlogSurround(options?: UseBlogSurroundOptions): import("#app").AsyncData<(ContentSurroundLink | null)[] | undefined, import("#app").NuxtError<unknown> | undefined>;
