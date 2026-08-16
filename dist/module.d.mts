import * as _nuxt_schema from '@nuxt/schema';
import { NormalizedBlogConfig, BlogModuleOptions } from './core.mjs';
export { BlogAuthorOptions, BlogCategoryOptions, BlogFeedOptions, BlogLabels, BlogSectionOptions, BlogSectionRoutes, NormalizedBlogSection } from './core.mjs';

declare module '@nuxt/schema' {
    interface PublicRuntimeConfig {
        happydesignsBlog: NormalizedBlogConfig;
    }
}
declare const _default: _nuxt_schema.NuxtModule<BlogModuleOptions, BlogModuleOptions, false>;

export { BlogModuleOptions as ModuleOptions, NormalizedBlogConfig, _default as default };
