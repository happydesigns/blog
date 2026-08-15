import { computed, toValue } from "vue";
import { createError, useRoute, useRuntimeConfig } from "#imports";
export function useBlogSection(sectionKey) {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const sections = runtimeConfig.public.happydesignsBlog.sections;
  const key = computed(() => {
    const requested = toValue(sectionKey);
    const routeSection = typeof route.meta.blogSection === "string" ? route.meta.blogSection : void 0;
    return requested ?? routeSection ?? Object.keys(sections)[0];
  });
  const section = computed(() => {
    const resolved = key.value ? sections[key.value] : void 0;
    if (!resolved) {
      throw createError({
        statusCode: 500,
        statusMessage: `[happydesigns/blog] Unknown section "${key.value ?? ""}".`
      });
    }
    return resolved;
  });
  return { key, section };
}
