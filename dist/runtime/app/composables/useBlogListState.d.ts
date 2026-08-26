import type { Ref } from 'vue';
export interface UseBlogListStateOptions {
    allLabel: Ref<string>;
    fixedCategory?: Ref<string | undefined>;
}
export declare function useBlogListState({ allLabel, fixedCategory }: UseBlogListStateOptions): {
    page: Ref<number, number>;
    selectedCategory: Ref<string, string>;
    queryForPage: (targetPage: number, { resetPage }?: {
        resetPage?: boolean | undefined;
    }) => import("../utils/blogListQuery.js").BlogQuery;
    updateQuery: ({ resetPage, replace }?: {
        resetPage?: boolean | undefined;
        replace?: boolean | undefined;
    }) => Promise<void>;
};
