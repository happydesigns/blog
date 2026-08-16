import { ref, watch } from "vue";
import { navigateTo, useRoute } from "#imports";
import { buildBlogListQuery, readBlogPage, readBlogQueryValue } from "../utils/blogListQuery.js";
export function useBlogListState({ allLabel, fixedCategory }) {
  const route = useRoute();
  const routeCategory = () => readBlogQueryValue(route.query.category);
  const page = ref(readBlogPage(route.query.page));
  const selectedCategory = ref(fixedCategory?.value ?? routeCategory() ?? allLabel.value);
  watch(() => fixedCategory?.value, (value) => {
    if (value)
      selectedCategory.value = value;
  });
  watch(() => route.query, () => {
    page.value = readBlogPage(route.query.page);
    if (!fixedCategory?.value)
      selectedCategory.value = routeCategory() ?? allLabel.value;
  });
  function queryForPage(targetPage, { resetPage = false } = {}) {
    return buildBlogListQuery(route.query, {
      page: targetPage,
      selectedCategory: selectedCategory.value,
      allLabel: allLabel.value,
      fixedCategory: fixedCategory?.value,
      resetPage
    });
  }
  async function updateQuery({ resetPage = false, replace = false } = {}) {
    await navigateTo({ query: queryForPage(page.value, { resetPage }) }, { replace });
  }
  return { page, selectedCategory, queryForPage, updateQuery };
}
