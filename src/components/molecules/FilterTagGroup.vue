<template>
  <div
    v-if="hasActiveFilters"
    class="flex flex-wrap items-center gap-2 border border-dashed border-gray-300 rounded-md py-1 px-2"
    aria-label="Active filters">
    <span class="label text-xs font-semibold">
      <Icon icon="tabler:filter" />
      Active Filters:
    </span>
    <TransitionGroup
      :name="motion ? 'tag-fade' : ''"
      tag="ul"
      class="list-unstyled flex flex-wrap items-center gap-2">
      <li
        v-for="(filter, key) in activeFilters"
        :key="`filter-tag-${key}`"
        class="leading-none">
        <ForwardSlots :slots="$slots">
          <FilterTag
            :filter-key="key"
            :filter="filter"
            @remove="emit('remove', key)" />
        </ForwardSlots>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Third-party
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { ForwardSlots } from '@evomark/vue-forward-slots'

// Types
import type { FilterConfig, FilterGroup } from '@/types/composables/useFilter.types'
import type {
  FilterTagGroupProps,
  FilterTagGroupEmits
} from '@/types/components/FilterTagGroup.types'
import type { FilterTagProps } from '@/types/components/FilterTag.types'

// Components
import FilterTag from '@/components/atoms/FilterTag.vue'

const {
  columns = [],
  filterConfig = {},
  motion = true,
} = defineProps<FilterTagGroupProps<T>>()

const emit = defineEmits<FilterTagGroupEmits<T>>()

// Retrieves the label for a given filter key based on column config
const getActiveFilterLabel = (key: Extract<keyof T, string>) => {
  const column = columns.find((column) => column.key === key)
  if (!column) return `Unknown (${key})`
  return column.label
}

// Computes the list of active filters based on the filterConfig
const activeFilters = computed(() => {
  return Object.entries(filterConfig).reduce((acc, [key, filter]) => {
    const { condition, value } = filter as FilterGroup<T>
    const column = columns.find((column) => column.key === key)

    if (condition !== null && value !== null) {
      acc[key as Extract<keyof T, string>] = {
        ...(filter as FilterConfig<T>),
        label: getActiveFilterLabel(key as Extract<keyof T, string>),
        filterTagValFormatter: column ? column?.filterTagValFormatter : undefined,
      } as FilterTagProps<T>['filter']
    }
    return acc
  }, {} as Record<Extract<keyof T, string>, FilterTagProps<T>['filter']>)
})

const hasActiveFilters = computed(() => Object.keys(activeFilters.value).length > 0)
</script>

<style scoped>
.tag-fade-enter-active,
.tag-fade-leave-active {
  transition: opacity 0.25s ease-in, transform 0.25s ease-in;
}

.tag-fade-enter-from,
.tag-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
