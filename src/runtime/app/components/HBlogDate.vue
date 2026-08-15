<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value?: string | Date
  locale?: string
}>()

const parsed = computed(() => props.value ? new Date(props.value) : null)
const iso = computed(() => parsed.value && Number.isFinite(parsed.value.getTime()) ? parsed.value.toISOString() : undefined)
const formatted = computed(() => {
  if (!parsed.value || !iso.value)
    return undefined
  return new Intl.DateTimeFormat(props.locale ?? 'en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed.value)
})
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
