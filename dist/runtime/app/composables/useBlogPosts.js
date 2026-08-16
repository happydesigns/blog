import { computed, toValue } from "vue";
import { queryCollection, useAsyncData } from "#imports";
import { getBlogPostCategories, isBlogPostVisible, paginateBlogItems } from "../../../core";
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
    const indexFields = [.../* @__PURE__ */ new Set([
      "path",
      "published",
      "status",
      "publishedAt",
      "category",
      "categories",
      "tags",
      "authors",
      currentSection.sort.field
    ])];
    let indexQuery = queryCollection(currentSection.collection);
    indexQuery = indexQuery.where("published", "=", true);
    indexQuery = indexQuery.order(currentSection.sort.field, currentSection.sort.direction);
    const visiblePosts = (await indexQuery.select(...indexFields).all()).filter((post) => isBlogPostVisible(post)).filter((post) => !category.value || getBlogPostCategories(post).includes(category.value)).filter((post) => !tag.value || post.tags?.includes(tag.value)).filter((post) => !author.value || post.authors?.includes(author.value));
    const pagination = paginateBlogItems(visiblePosts, page.value, itemsPerPage.value);
    const selectedPaths = pagination.items.map((post) => post.path);
    const pageDocuments = selectedPaths.length > 0 ? await queryCollection(currentSection.collection).where("path", "IN", selectedPaths).all() : [];
    const documentsByPath = new Map(pageDocuments.map((post) => [post.path, post]));
    const paginatedPosts = selectedPaths.flatMap((path) => {
      const post = documentsByPath.get(path);
      return post ? [post] : [];
    });
    const authors = await resolveBlogAuthors(paginatedPosts, currentSection.features.authors && currentSection.features.authors.collection);
    const posts = paginatedPosts.map((post) => {
      const categoryKey = currentSection.features.taxonomy ? getBlogPostCategories(post)[0] : void 0;
      const categoryOptions = categoryKey && currentSection.features.taxonomy ? currentSection.features.taxonomy.categories[categoryKey] : void 0;
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
    return {
      posts,
      page: pagination.page,
      pageCount: pagination.pageCount,
      total: pagination.total
    };
  }, {
    lazy: toValue(options.lazy) ?? false,
    default: () => ({ posts: [], page: 1, pageCount: 0, total: 0 })
  });
}
