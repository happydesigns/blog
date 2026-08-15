import { computed, toValue } from "vue";
import { queryCollection, useAsyncData } from "#imports";
import { getBlogPostCategories, isBlogPostVisible } from "../../../core";
import { useBlogSection } from "./useBlogSection.js";
export async function resolveBlogAuthors(posts, collection) {
  if (!collection)
    return /* @__PURE__ */ new Map();
  const usernames = [...new Set(posts.flatMap((post) => post.authors ?? []))];
  if (usernames.length === 0)
    return /* @__PURE__ */ new Map();
  const query = queryCollection(collection);
  const authors = await query.where("username", "IN", usernames).select("username", "name", "description", "to", "avatar").all();
  return new Map(authors.map(({ username, ...author }) => [username, author]));
}
export function useBlogPosts(options = {}) {
  const { key: sectionKey, section } = useBlogSection(options.section);
  const page = computed(() => Math.max(1, toValue(options.page) ?? 1));
  const itemsPerPage = computed(() => Math.max(1, toValue(options.itemsPerPage) ?? section.value.itemsPerPage));
  const category = computed(() => toValue(options.category));
  const tag = computed(() => toValue(options.tag));
  const author = computed(() => toValue(options.author));
  const asyncKey = computed(() => [
    "happydesigns-blog",
    sectionKey.value,
    page.value,
    itemsPerPage.value,
    category.value ?? "",
    tag.value ?? "",
    author.value ?? ""
  ].join(":"));
  return useAsyncData(asyncKey, async () => {
    const currentSection = section.value;
    let query = queryCollection(currentSection.collection);
    query = query.where("published", "=", true);
    query = query.order(currentSection.sort.field, currentSection.sort.direction);
    const visiblePosts = (await query.all()).filter((post) => isBlogPostVisible(post)).filter((post) => !category.value || getBlogPostCategories(post).includes(category.value)).filter((post) => !tag.value || post.tags?.includes(tag.value)).filter((post) => !author.value || post.authors?.includes(author.value));
    const start = (page.value - 1) * itemsPerPage.value;
    const paginated = visiblePosts.slice(start, start + itemsPerPage.value);
    const authors = await resolveBlogAuthors(paginated, currentSection.authors && currentSection.authors.collection);
    const posts = paginated.map((post) => {
      const categoryKey = getBlogPostCategories(post)[0];
      const categoryOptions = categoryKey ? currentSection.categories[categoryKey] : void 0;
      return {
        ...post,
        resolvedBadge: categoryKey ? {
          label: categoryOptions?.label ?? categoryKey,
          color: categoryOptions?.color ?? "primary",
          icon: categoryOptions?.icon
        } : void 0,
        resolvedAuthors: (post.authors ?? []).flatMap((username) => {
          const resolved = authors.get(username);
          return resolved ? [resolved] : [];
        })
      };
    });
    return { posts, total: visiblePosts.length };
  }, {
    lazy: toValue(options.lazy) ?? false,
    default: () => ({ posts: [], total: 0 })
  });
}
