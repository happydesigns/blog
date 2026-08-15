<script setup>
import { computed } from "vue";
const props = defineProps({
  value: { type: [String, Date], required: false },
  locale: { type: String, required: false }
});
const parsed = computed(() => props.value ? new Date(props.value) : null);
const iso = computed(() => parsed.value && Number.isFinite(parsed.value.getTime()) ? parsed.value.toISOString() : void 0);
const formatted = computed(() => {
  if (!parsed.value || !iso.value)
    return void 0;
  return new Intl.DateTimeFormat(props.locale ?? "en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(parsed.value);
});
</script>

<template>
  <time
    v-if="formatted"
    :datetime="iso"
    class="text-xs text-muted"
  >
    {{ formatted }}
  </time>
</template>
