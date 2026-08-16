export type BlogQueryValue = string | number | null | undefined | Array<string | number | null>;
export type BlogQuery = Record<string, BlogQueryValue>;
export interface BuildBlogListQueryOptions {
    page: number;
    selectedCategory: string;
    allLabel: string;
    fixedCategory?: string;
    resetPage?: boolean;
}
export declare function readBlogQueryValue(value: BlogQueryValue): string | undefined;
export declare function readBlogPage(value: BlogQueryValue): number;
export declare function buildBlogListQuery(currentQuery: BlogQuery, options: BuildBlogListQueryOptions): BlogQuery;
