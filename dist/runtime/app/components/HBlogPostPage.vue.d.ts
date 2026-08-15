type __VLS_Props = {
    section?: string;
    path?: string;
    preview?: boolean;
};
declare var __VLS_30: {
    post: import("#imports").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
}, __VLS_44: {
    post: import("#imports").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
}, __VLS_46: {
    post: import("#imports").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
}, __VLS_53: {
    post: import("#imports").ResolvedBlogPost;
    section: import("../../../core.js").NormalizedBlogSection;
};
type __VLS_Slots = {} & {
    header?: (props: typeof __VLS_30) => any;
} & {
    before?: (props: typeof __VLS_44) => any;
} & {
    default?: (props: typeof __VLS_46) => any;
} & {
    after?: (props: typeof __VLS_53) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
