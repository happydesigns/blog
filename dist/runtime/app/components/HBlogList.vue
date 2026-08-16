<script setup>
import { computed, watch } from "vue";
import { useBlogListState } from "../composables/useBlogListState";
import { useBlogPosts } from "../composables/useBlogPosts";
import { useBlogSection } from "../composables/useBlogSection";
const props = defineProps({
  section: { type: String, required: false },
  category: { type: String, required: false },
  tag: { type: String, required: false },
  author: { type: String, required: false },
  orientation: { type: String, required: false, default: "horizontal" },
  itemsPerPage: { type: Number, required: false },
  showCategories: { type: Boolean, required: false, default: true },
  showPreviewImages: { type: Boolean, required: false, default: void 0 }
});
const { section } = useBlogSection(() => props.section);
const allLabel = computed(() => section.value.labels.all);
const { page, selectedCategory, updateQuery } = useBlogListState({
  allLabel,
  fixedCategory: computed(() => props.category)
});
const effectiveCategory = computed(() => selectedCategory.value === allLabel.value ? void 0 : selectedCategory.value);
const itemsPerPage = computed(() => props.itemsPerPage ?? section.value.itemsPerPage);
const showPreviewImages = computed(() => props.showPreviewImages ?? section.value.features.list.previewImages);
const taxonomyCategories = computed(() => section.value.features.taxonomy ? section.value.features.taxonomy.categories : {});
const { data, status } = await useBlogPosts({
  section: () => props.section,
  page,
  itemsPerPage,
  category: effectiveCategory,
  tag: () => props.tag,
  author: () => props.author
});
const categories = computed(() => [
  { label: allLabel.value, value: allLabel.value },
  ...Object.entries(taxonomyCategories.value).map(([value, options]) => ({
    label: options.label ?? value,
    value
  }))
].map((item) => ({
  label: item.label,
  active: selectedCategory.value === item.value,
  onSelect: () => {
    selectedCategory.value = item.value;
    void updateQuery({ resetPage: true });
  }
})));
watch(page, () => {
  void updateQuery();
  if (import.meta.client)
    window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <UNavigationMenu
      v-if="showCategories && !category && Object.keys(taxonomyCategories).length > 0"
      :items="categories"
      class="border-b border-default"
      highlight
    />

    <div
      v-if="status === 'pending' && data.posts.length === 0"
      class="flex justify-center py-20"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-10 animate-spin text-muted"
      />
    </div>

    <UBlogPosts
      v-else-if="data.posts.length > 0"
      :orientation="orientation"
      :ui="{
  base: orientation === 'horizontal' ? 'sm:grid sm:grid-cols-2 lg:grid-cols-3' : ''
}"
      :class="{ 'opacity-50 transition-opacity': status === 'pending' }"
    >
      <slot
        v-for="post in data.posts"
        :key="post.path"
        name="post"
        :post="post"
        :section="section"
      >
        <UBlogPost
          :to="post.path"
          :title="post.title"
          :description="post.description"
          :image="showPreviewImages ? post.image : void 0"
          :badge="post.resolvedBadge"
          :authors="post.resolvedAuthors"
          variant="subtle"
          :ui="{
  title: 'line-clamp-2',
  description: 'line-clamp-3'
}"
        >
          <template #date>
            <slot
              name="date"
              :post="post"
              :section="section"
            >
              <HBlogDate
                :value="post.publishedAt ?? post.date"
                :locale="section.locale"
              />
            </slot>
          </template>
        </UBlogPost>
      </slot>
    </UBlogPosts>

    <div
      v-else
      class="flex flex-col items-center justify-center py-20 text-center text-muted"
    >
      <UIcon
        name="i-lucide-newspaper"
        class="mb-4 size-12 opacity-20"
      />
      <p>{{ section.labels.empty }}</p>
    </div>

    <div
      v-if="data.total > itemsPerPage"
      class="flex justify-center"
    >
      <UPagination
        v-model:page="page"
        :total="data.total"
        :items-per-page="itemsPerPage"
      />
    </div>
  </div>
</template>
