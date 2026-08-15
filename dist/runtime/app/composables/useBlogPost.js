import { computed, toValue } from "vue";
import { queryCollection, useAsyncData, useRoute } from "#imports";
import { getBlogPostCategories, isBlogPostVisible } from "../../../core";
import { useBlogSection } from "./useBlogSection.js";
import { resolveBlogAuthors } from "./useBlogPosts.js";
export function useBlogPost(options = {}) {
  const route = useRoute();
  const { key: sectionKey, section } = useBlogSection(options.section);
  const path = computed(() => toValue(options.path) ?? route.path);
  const preview = computed(() => toValue(options.preview) ?? false);
  const asyncKey = computed(() => `happydesigns-blog:${sectionKey.value}:post:${path.value}:${preview.value}`);
  return useAsyncData(asyncKey, async () => {
    const query = queryCollection(section.value.collection);
    const post = await query.path(path.value).first();
    if (!post)
      return null;
    if (!preview.value && !isBlogPostVisible(post))
      return null;
    const authors = await resolveBlogAuthors([post], section.value.authors && section.value.authors.collection);
    const categoryKey = getBlogPostCategories(post)[0];
    const categoryOptions = categoryKey ? section.value.categories[categoryKey] : void 0;
    const resolved = {
      ...post,
      resolvedBadge: categoryKey ? {
        label: categoryOptions?.label ?? categoryKey,
        color: categoryOptions?.color ?? "primary",
        icon: categoryOptions?.icon
      } : void 0,
      resolvedAuthors: (post.authors ?? []).flatMap((username) => {
        const author = authors.get(username);
        return author ? [author] : [];
      })
    };
    return resolved;
  });
}
