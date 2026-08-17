import { computed, toValue } from "vue";
import { queryCollection, useAsyncData, useRoute } from "#imports";
import { isBlogPostVisible } from "../../../core";
import { useBlogSection } from "./useBlogSection.js";
function toSurroundLink(post) {
  if (!post)
    return null;
  return {
    path: post.path,
    title: post.title,
    description: post.description
  };
}
export function useBlogSurround(options = {}) {
  const route = useRoute();
  const { key: sectionKey, section } = useBlogSection(options.section);
  const path = computed(() => toValue(options.path) ?? route.path);
  const asyncKey = computed(() => `happydesigns-blog:${sectionKey.value}:surround:${path.value}`);
  return useAsyncData(asyncKey, async () => {
    const currentSection = section.value;
    const fields = [.../* @__PURE__ */ new Set([
      "path",
      "title",
      "description",
      "published",
      "status",
      "publishedAt",
      currentSection.sort.field
    ])];
    let query = queryCollection(currentSection.collection);
    query = query.where("published", "=", true);
    query = query.order(currentSection.sort.field, currentSection.sort.direction);
    const visiblePosts = (await query.select(...fields).all()).filter((post) => isBlogPostVisible(post));
    const currentIndex = visiblePosts.findIndex((post) => post.path === path.value);
    if (currentIndex === -1)
      return [null, null];
    return [
      toSurroundLink(visiblePosts[currentIndex - 1]),
      toSurroundLink(visiblePosts[currentIndex + 1])
    ];
  });
}
