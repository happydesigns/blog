type BlogPublicationStatus = 'draft' | 'scheduled' | 'published';
type BlogSortDirection = 'ASC' | 'DESC';
interface BlogCategoryOptions {
    label?: string;
    color?: string;
    icon?: string;
}
interface BlogLabels {
    all: string;
    empty: string;
    previous: string;
    next: string;
}
interface BlogSectionRoutes {
    index: string | false;
    post: string | false;
    category: string | false;
    tag: string | false;
    author: string | false;
}
interface BlogFeedOptions {
    rss?: string | false;
    atom?: string | false;
    title?: string;
    description?: string;
    siteUrl?: string;
    language?: string;
    copyright?: string;
    favicon?: string;
}
interface BlogAuthorOptions {
    collection: string;
}
interface BlogListFeatureOptions {
    previewImages?: boolean;
}
interface BlogTaxonomyFeatureOptions {
    categories?: Record<string, BlogCategoryOptions>;
}
interface BlogSectionFeatures {
    list?: BlogListFeatureOptions;
    authors?: BlogAuthorOptions | false;
    taxonomy?: BlogTaxonomyFeatureOptions | false;
    syndication?: BlogFeedOptions | false;
}
interface BlogSectionOptions {
    collection: string;
    basePath?: string;
    title?: string;
    description?: string;
    locale?: string;
    itemsPerPage?: number;
    features?: BlogSectionFeatures;
    /** @deprecated Use `features.list.previewImages`. */
    showPreviewImages?: boolean;
    sort?: {
        field?: string;
        direction?: BlogSortDirection;
    };
    /** @deprecated Use `features.taxonomy.categories`. */
    categories?: Record<string, BlogCategoryOptions>;
    labels?: Partial<BlogLabels>;
    /** @deprecated Use `features.authors`. */
    authors?: BlogAuthorOptions | false;
    routes?: Partial<BlogSectionRoutes> | false;
    /** @deprecated Use `features.syndication`. */
    feed?: BlogFeedOptions | false;
}
interface BlogModuleOptions {
    sections?: Record<string, BlogSectionOptions>;
}
interface NormalizedBlogSection {
    key: string;
    collection: string;
    basePath: string;
    title: string;
    description?: string;
    locale: string;
    itemsPerPage: number;
    sort: {
        field: string;
        direction: BlogSortDirection;
    };
    labels: BlogLabels;
    features: {
        list: Required<BlogListFeatureOptions>;
        authors: BlogAuthorOptions | false;
        taxonomy: Required<BlogTaxonomyFeatureOptions> | false;
        syndication: Required<Pick<BlogFeedOptions, 'rss' | 'atom'>> & Omit<BlogFeedOptions, 'rss' | 'atom'> | false;
    };
    routes: BlogSectionRoutes;
}
interface NormalizedBlogConfig {
    sections: Record<string, NormalizedBlogSection>;
}
interface BlogPublication {
    path?: string;
    title?: string;
    description?: string;
    date?: string | Date;
    publishedAt?: string | Date;
    updatedAt?: string | Date;
    published?: boolean;
    status?: BlogPublicationStatus;
    authors?: string[];
    category?: string;
    categories?: string[];
    tags?: string[];
    image?: {
        src: string;
        alt?: string;
        width?: number;
        height?: number;
        position?: string;
    };
    [key: string]: unknown;
}
interface BlogPaginationResult<T> {
    items: T[];
    page: number;
    pageCount: number;
    total: number;
}
declare function defineBlogConfig<const T extends BlogModuleOptions>(config: T): T;
declare function normalizeBasePath(path: string): string;
declare function normalizeBlogConfig(options?: BlogModuleOptions): NormalizedBlogConfig;
declare function isBlogPostVisible(post: BlogPublication, now?: Date): boolean;
declare function getBlogPostCategories(post: BlogPublication): string[];
declare function paginateBlogItems<T>(items: T[], requestedPage: number, requestedItemsPerPage: number): BlogPaginationResult<T>;
declare function joinBlogUrl(base: string, path: string): string;

export { defineBlogConfig, getBlogPostCategories, isBlogPostVisible, joinBlogUrl, normalizeBasePath, normalizeBlogConfig, paginateBlogItems };
export type { BlogAuthorOptions, BlogCategoryOptions, BlogFeedOptions, BlogLabels, BlogListFeatureOptions, BlogModuleOptions, BlogPaginationResult, BlogPublication, BlogPublicationStatus, BlogSectionFeatures, BlogSectionOptions, BlogSectionRoutes, BlogSortDirection, BlogTaxonomyFeatureOptions, NormalizedBlogConfig, NormalizedBlogSection };
