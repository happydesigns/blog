type __VLS_Props = {
    section?: string;
    category?: string;
    tag?: string;
    author?: string;
    orientation?: 'horizontal' | 'vertical';
    itemsPerPage?: number;
    showCategories?: boolean;
};
declare var __VLS_17: {
    key: string;
    post: import("../composables/useBlogPosts.js").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
}, __VLS_26: {
    post: import("../composables/useBlogPosts.js").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
};
type __VLS_Slots = {} & {
    post?: (props: typeof __VLS_17) => any;
} & {
    date?: (props: typeof __VLS_26) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    orientation: "horizontal" | "vertical";
    showCategories: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
