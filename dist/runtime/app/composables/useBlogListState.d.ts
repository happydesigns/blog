import type { Ref } from 'vue';
export interface UseBlogListStateOptions {
    allLabel: Ref<string>;
    fixedCategory?: Ref<string | undefined>;
}
export declare function useBlogListState({ allLabel, fixedCategory }: UseBlogListStateOptions): {
    page: Ref<number, number>;
    selectedCategory: Ref<string, string>;
    updateQuery: ({ resetPage }?: {
        resetPage?: boolean | undefined;
    }) => Promise<void>;
};
