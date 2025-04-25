<template>
  <span
    class="badge badge-soft badge-sm"
    :aria-label="tooltipDescription ?? ''"
    :title="tooltipDescription ?? ''">
    <slot
      :name="`filter-tag-${filterKey}-label`"
      v-bind="{ label: filterLabel, value: filter.value }">
      <span v-html="filterLabel"></span>
    </slot>
    <button
      type="button"
      class="btn btn-xs btn-ghost p-0 h-min"
      :title="`Remove ${filter.label} filter`"
      :aria-label="`Remove ${filter.label} filter`"
      @click="emit('remove')">
      <Icon icon="tabler:x" />
      <span class="sr-only">Remove {{ filter.label }} filter</span>
    </button>
  </span>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Third-party
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

// Types
import type { FilterTagProps, FilterTagEmits } from '@/types/components/FilterTag.types'

// Utils
import {
  filterConditionDescriptions,
  filterConditionSymbols,
} from'@/utils/useFilter.util'

const {
  filterKey,
  filter,
} = defineProps<FilterTagProps<T>>()

const emit = defineEmits<FilterTagEmits>()

const isValidDate = (value: any) => {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
}

const formatDate = (value: string | Date) => {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

const formatArrayValue = (value: any[]) =>
  value.map((v) => (isValidDate(v) ? formatDate(v) : v))

// Formats the filter value based on its type and condition for display in the template.
// Handles dates, arrays, and other types.
const displayValue = computed(() => {
  const condition = filter.condition;
  let value = filter.value;

  if (filter.filterTagValFormatter) {
    return filter.filterTagValFormatter(value)
  }

  if (!condition || value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
    return 'N/A'
  }
  if (condition === 'notEmpty') return null;

  if (Array.isArray(value)) {
    value = formatArrayValue(value)
  } else if (isValidDate(value)) {
    value = formatDate(value)
  }

  if (condition === 'between') {
    return `${value[0]} - ${value[1]}`
  }

  return value
})

// Generates the label for the filter tag, including the condition symbol.
const filterLabel = computed(() => {
  if (!filter.condition) return null;
  if (filter.condition === 'notEmpty') {
    return `${filter.label} not empty`
  }

  if (filter.condition === 'between') {
    return `${filter.label} ${displayValue.value}`
  }

  return `<strong class="font-semibold">${filter.label}</strong> ${filterConditionSymbols[filter.condition]} ${displayValue.value}`
})

// Provides a more descriptive tooltip for the filter tag.
const tooltipDescription = computed(() => {
  if (!filter.condition) return null;
  if (filter.condition === 'notEmpty') {
    return `${filter.label} is not empty`
  }

  return `${filter.label} ${filterConditionDescriptions[filter.condition]} ${displayValue.value}`
})
</script>
