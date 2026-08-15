import { ref, watch } from "vue";
import { navigateTo, useRoute } from "#imports";
export function useBlogListState({ allLabel, fixedCategory }) {
  const route = useRoute();
  const routeCategory = () => Array.isArray(route.query.category) ? route.query.category[0] : route.query.category;
  const routePage = () => Array.isArray(route.query.page) ? route.query.page[0] : route.query.page;
  const page = ref(Math.max(1, Number(routePage()) || 1));
  const selectedCategory = ref(fixedCategory?.value ?? routeCategory() ?? allLabel.value);
  watch(() => fixedCategory?.value, (value) => {
    if (value)
      selectedCategory.value = value;
  });
  watch(() => route.query, () => {
    page.value = Math.max(1, Number(routePage()) || 1);
    if (!fixedCategory?.value)
      selectedCategory.value = routeCategory() ?? allLabel.value;
  });
  async function updateQuery({ resetPage = false } = {}) {
    const query = { ...route.query };
    if (resetPage || page.value === 1)
      delete query.page;
    else
      query.page = String(page.value);
    if (!fixedCategory?.value) {
      if (selectedCategory.value === allLabel.value)
        delete query.category;
      else
        query.category = selectedCategory.value;
    }
    await navigateTo({ query });
  }
  return { page, selectedCategory, updateQuery };
}
