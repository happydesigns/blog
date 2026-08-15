import type { MaybeRefOrGetter } from 'vue';
import type { NormalizedBlogSection } from '../../../core.js';
export declare function useBlogSection(sectionKey?: MaybeRefOrGetter<string | undefined>): {
    key: import("vue").ComputedRef<string | undefined>;
    section: import("vue").ComputedRef<NormalizedBlogSection>;
};
