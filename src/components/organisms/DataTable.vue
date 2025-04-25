<template>
  <ForwardSlots :slots="$slots">
    <div class="data-table">
      <div
        v-if="searchable"
        class="flex flex-wrap justify-between items-start gap-2 mb-4">
        <FormItem
          v-model="searchConfig.query"
          :html-for="searchInputId"
          class="max-w-96 w-full mb-0!"
          :input-props="{ size }"
          label="Search" />
          <Transition
            :name="motion ? 'filter-tag-group-fade' : ''"
            mode="out-in">
            <FilterTagGroup
              :filter-config="filterConfig"
              :columns="columns"
              :motion="motion"
              @remove="removeFilter" />
          </Transition>
      </div>
      <div class="flex items-center justify-between gap-2 text-sm opacity-60">
        <span>{{ resultsCountText }}</span>
        <span v-if="sortConfig.key && sortConfig.order">
          Sorting by <span class="font-semibold">{{ currentSortedColumn?.label }}</span> {{ sortLabels[sortConfig.order] }}
        </span>
        </div>
        <PaginationBase
          class="my-4"
          v-model:page="paginationConfig.page"
          v-model:perPage="paginationConfig.perPage"
          :disabled="!rows || !visibleRows?.length"
          :total="filteredRows.length"
          :size="size" />
      <div
        :class="{
          'data-table__wrapper': true,
          'overflow-x-auto overflow-y-visible': responsive,
        }">
        <table v-bind="computedTableAttrs">
          <thead>
            <tr>
              <!-- Optional select column -->
              <th v-if="slots['header-_select']" class="w-10">
                <slot name="header-_select"></slot>
              </th>
              <th
                v-for="column in visibleColumns"
                :key="column.key"
                scope="col"
                v-bind="{
                  class: [
                    'text-left font-semibold',
                    column.thAttrs?.class,
                    {
                      'w-10': column.key === '_select',
                      'w-24': column.key === '_expand',
                    }
                  ],
                  ...column.thAttrs,
                }">
                <input
                  v-if="column.key === '_select'"
                  type="checkbox"
                  :class="['checkbox', {
                    'checkbox-xs': size === 'xs',
                    'checkbox-sm': size === 'sm',
                    'checkbox-md': size === 'md',
                    'checkbox-lg': size === 'lg',
                    'checkbox-xl': size === 'xl',
                  }]"
                  :checked="areAllSelected(rowKeys)"
                  :indeterminate="isIndeterminate(rowKeys)"
                  :title="areAllSelected(rowKeys) ? 'Deselect all rows' : 'Select all rows'"
                  :aria-label="areAllSelected(rowKeys) ? 'Deselect all rows' : 'Select all rows'"
                  @change="() => areAllSelected(rowKeys) ? deselectAll() : selectAll(rowKeys)" />
                <slot
                  v-else
                  :name="`header-${String(column.key)}`"
                  v-bind="{ column }">
                  <slot
                    name="header"
                    v-bind="{ column }">
                    <div class="flex items-center gap-1 w-full relative">
                      <button
                        v-if="column.sortable"
                        class="btn bg-transparent border-none px-0 btn-xs"
                        :title="getColumnSortLabel(column)"
                        @click="handleCycleSort(column.key)">
                        <span class="inline-flex flex-col relative">
                          <Icon
                            v-if="sortConfig.key === column.key && sortConfig.order !== null"
                            :icon="sortConfig.order === 'asc' ? 'tabler:caret-up-filled' : 'tabler:caret-down-filled'" />
                          <template v-else>
                            <Icon icon="tabler:caret-up" class="-mb-1" />
                            <Icon icon="tabler:caret-down" />
                          </template>
                          <span class="sr-only">{{ getColumnSortLabel(column) }}</span>
                        </span>
                      </button>
                      <span>{{ column.label }}</span>
                      <button
                        v-if="column.filterable"
                        class="btn btn-xs bg-transparent border-none px-0 "
                        :title="isFilterVisible(column.key) ? 'Hide filter' : 'Show filter'"
                        @click="toggleFilterVisibility(column.key)">
                        <Icon :icon="isFilterVisible(column.key) || filterConfig[column.key]?.value ? 'tabler:filter-filled' : 'tabler:filter'" />
                        <span class="sr-only">Filter {{ column.label }}</span>
                      </button>
                      <!-- 
                        // NOTE: When there are very few rows, the filter popover may overflow the table container.
                        // This is a known edge case due to absolute positioning and can be resolved with advanced
                        // portal + positioning logic in a production implementation.
                      -->
                      <Transition
                        :name="motion ? 'column-filter-popover-fade' : ''"
                        mode="out-in">
                        <div
                          v-if="isFilterVisible(column.key)"
                          class="absolute top-full left-0 bg-base-100 border border-base-300 rounded-md shadow-lg px-2 pt-4 pb-2 mb-2 z-10 max-w-[340px] w-auto"
                          tabindex="-1"
                          :aria-hidden="!isFilterVisible(column.key)"
                          @keydown.esc="toggleFilterVisibility(column.key)">
                          <!-- v-model:filter-config="filterConfig[column.key as Extract<keyof T, string>]" -->
                          <ColumnFilterPopover
                            v-model:filter-config="filterConfig[column.key as Extract<keyof T, string>]"
                            :column="column"
                            :motion="motion"
                            @close="toggleFilterVisibility(column.key)" />
                        </div>
                      </transition>
                    </div>
                  </slot>
                </slot>
              </th>
            </tr>
          </thead>
          <tbody>
            <template
              v-if="visibleRows?.length"
              v-for="(row, rowIndex) in visibleRows"
              :key="typeof rowKey === 'function' ? rowKey(row) : rowKey ? row[rowKey] : rowIndex">
              <slot name="row" v-bind="{ row, rowIndex }">
                <tr
                  v-if="!slots.row"
                  :class="{ 'hover:bg-base-300! transition-colors': hoverable }">
                  <td
                    v-for="column in visibleColumns"
                    :key="column.key"
                    v-bind="{
                      class: [
                        'text-left',
                        column.tdAttrs?.class,
                      ],
                      ...column.tdAttrs,
                    }">
                    <input
                      v-if="column.key === '_select'"
                      type="checkbox"
                      :class="['checkbox', {
                        'checkbox-xs': size === 'xs',
                        'checkbox-sm': size === 'sm',
                        'checkbox-md': size === 'md',
                        'checkbox-lg': size === 'lg',
                        'checkbox-xl': size === 'xl',
                      }]"
                      :checked="isSelected(row[rowKey])"
                      :title="`${isSelected(row[rowKey]) ? 'Deselect' : 'Select'} row with ID ${row[rowKey]}`"
                      :aria-label="`${isSelected(row[rowKey]) ? 'Deselect row' : 'Select row'} with ID ${row[rowKey]}`"
                      @change="() => toggleSelection(row[rowKey])" />
                    <button
                      v-else-if="column.key === '_expand'"
                      :class="['btn btn-ghost', {
                        'btn-active': isRowExpanded(row[rowKey]),
                        'btn-xs': size === 'xs',
                        'btn-sm': size === 'sm',
                        'btn-md': size === 'md',
                        'btn-lg': size === 'lg',
                        'btn-xl': size === 'xl',
                      }]"
                      :title="isRowExpanded(row[rowKey]) ? 'Collapse row details' : 'Expand row details'"
                      :aria-expanded="isRowExpanded(row[rowKey])"
                      :aria-controls="`details-${row[rowKey]}`"
                      @click="toggleRowDetails(row[rowKey])">
                      <Icon :icon="isRowExpanded(row[rowKey]) ? 'tabler:chevron-up' : 'tabler:chevron-down'" />
                      <span class="sr-only">
                        {{ isRowExpanded(row[rowKey]) ? 'Collapse' : 'Expand' }} row details
                      </span>
                    </button>
                    <slot
                      v-else
                      :name="`cell-${String(column.key)}`"
                      v-bind="getCellProps(row, column)">
                      <slot
                        name="cell"
                        v-bind="getCellProps(row, column)">
                        {{ column.formatter ? column.formatter(row[column.key], row) : row[column.key] }}
                      </slot>
                    </slot>
                  </td>
                  <td v-if="slots['cell-_actions']" class="w-24">
                    <slot name="cell-_actions" v-bind="{ row, rowIndex }" />
                  </td>
                </tr>
                <Transition name="details" mode="out-in">
                  <tr
                    v-if="visibleColumnKeys.includes('_expand') && isRowExpanded(row[rowKey])"
                    :id="`details-${row[rowKey]}`">
                    <td :colspan="visibleColumns.length">
                      <slot
                        name="details"
                        v-bind="{ row }">
                      </slot>
                    </td>
                  </tr>
                </Transition>
              </slot>
            </template>
            <template v-else>
              <td :colspan="visibleColumns.length">
                <slot name="empty">
                  <div class="flex flex-col items-center py-8">
                    <span class="inline-flex items-center gap-x-1 opacity-60 italic mx-auto">
                      <Icon icon="tabler:info-circle" />
                      No data available
                    </span>
                  </div>
                </slot>
              </td>
            </template>
          </tbody>
        </table>
      </div>
      <PaginationBase
        class="my-4"
        v-model:page="paginationConfig.page"
        v-model:perPage="paginationConfig.perPage"
        :disabled="!rows || !visibleRows?.length"
        :total="filteredRows.length"
        :size="size" />
    </div>
  </ForwardSlots>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Third-party
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { ForwardSlots } from '@evomark/vue-forward-slots'

// Types
import {
  type ColumnDefinition,
  type ColumnKey,
  type DataTableSharedProps,
  type DataTableSlots,
  type DataTableEmits,
  specialPurposeColumnKeys,
} from '@/types/components/DataTable.types'
import type { SearchConfig } from '@/types/composables/useSearch.types'
import type { SortConfig } from '@/types/composables/useSort.types'
import type { FilterConfig } from '@/types/composables/useFilter.types'
import type { PaginationConfig } from '@/types/composables/usePagination.types'

// Utility
import { sortLabels } from '@/utils/useSort.util'

// Composables
import { useId } from '@/composables/useId'
import { useHydratedModel } from '@/composables/useHydratedModel'
import { useSearch } from '@/composables/useSearch'
import { useSort } from '@/composables/useSort'
import { useFilter } from '@/composables/useFilter'
import { usePagination } from '@/composables/usePagination'
import { useRowSelection } from '@/composables/useRowSelection'
import { useRowDetailsToggle } from '@/composables/useRowDetailsToggle'

// Components
import FilterTagGroup from '@/components/molecules/FilterTagGroup.vue'
import FormItem from '@/components/molecules/FormItem.vue'
import ColumnFilterPopover from '@/components/molecules/ColumnFilterPopover.vue'
import PaginationBase from '@/components/molecules/PaginationBase.vue'

const {
  id,
  columns = [],
  rowKey,
  searchable = true,
  responsive = false,
  hoverable = false,
  striped = false,
  motion = true,
  fixed = true,
  size = 'md',
  tableAttrs = {},
} = defineProps<DataTableSharedProps<T>>()

const slots = defineSlots<DataTableSlots<T>>()
const emit = defineEmits<DataTableEmits<T>>()

const rowsModel = defineModel<T[]>('rows', {})
const rows = useHydratedModel(rowsModel, [])

// # Region basic table configuration
// Centralized bindings for table attributes
const tableSizeClassMap = {
  xs: 'table-xs',
  sm: 'table-sm',
  md: 'table-md',
  lg: 'table-lg',
  xl: 'table-xl',
};

const computedTableAttrs = computed(() => {
  return {
    ...tableAttrs,
    id,
    class: [
      'data-table',
      'table',
      striped ? 'table-zebra' : '',
      hoverable ? 'table-hover' : '',
      fixed ? 'table-fixed' : '',
      tableSizeClassMap[size],
      tableAttrs.class,
    ]
  }
});

// Filters columns to only include those not marked as hidden.
// By default, unless `visible` is explicitly set to false, all columns are visible.
const visibleColumns = computed(() =>
  columns.filter((column) => column && column.visible !== false))

const visibleColumnKeys = computed(() =>
  visibleColumns.value.map((column) => column.key))

// Used to provide props to the cell slot for a given column
const getCellProps = (row: T, column: ColumnDefinition<T>) => {
  if (!column) return {}
  const value = row[column.key]

  return {
    row,
    column,
    value,
  }
}
// #endregion

// #region Search
const searchInputId = useId('search') // The HTML ID for the search input field

const searchConfigModel = defineModel<SearchConfig<T>>('searchConfig', {})

const searchConfig = useHydratedModel(searchConfigModel, {
  query: '',
  keys: columns
    .filter((column) => {
      return !Object.keys(specialPurposeColumnKeys).includes(column.key) &&
        column.searchable !== false &&
        column.visible !== false
    })
    .map((column) => column.key as Extract<keyof T, string>),
  caseSensitive: false,
})

// Handles the search functionality for the table. Filters rows based on the search query and specified keys.
const { searchedData: searchedRows } = useSearch<T>(rows, searchConfig)

watch(
  // Watching derived serialized string given object ref mutation does not accurately
  // track old/new values
  () => JSON.stringify(searchConfig.value),
  () => resetPageIfNeeded(),
)
// #endregion

// #region Sort
const sortConfigModel = defineModel<SortConfig<T>>('sortConfig', {})

const sortConfig = useHydratedModel(sortConfigModel, {
  key: null,
  order: null,
})

const { sortedData: sortedRows, cycleSort } = useSort<T>(searchedRows, sortConfig)

const handleCycleSort = (key: ColumnKey<T>) => {
  if (Object.keys(specialPurposeColumnKeys).includes(key)) return;
  cycleSort(key as Extract<keyof T, string>);
}

// Small utility to generate a sort label for the sort button
const getColumnSortLabel = (column: ColumnDefinition<T>) => {
  const defaultSortLabel = `Sort by ${column.label} ascending`
  if (!sortConfig.value) return defaultSortLabel

  const { key, order } = sortConfig.value
  if (key !== column.key) return defaultSortLabel

  return order === 'asc'
    ? `Sort by ${column.label} descending`
    : `Stop sorting by ${column.label}`
}

// The currently sorted column object
const currentSortedColumn = computed(() => {
  if (!sortConfig.value || !sortConfig.value?.key) return null
  const column = columns.find((column) => column.key === sortConfig.value.key)
  return column ?? null
})

// Ensure that pagination is reset to page 1 when sort key and/or order changes
watch(
  // Watching derived serialized string given object ref mutation does not accurately
  // track old/new values
  () => `${String(sortConfig.value?.key)}:${sortConfig.value?.order}`,
  () => resetPageIfNeeded(),
)
// #endregion

// #region Filter
const filterConfigModel = defineModel<FilterConfig<T>>('filterConfig', {})
const filterConfig = useHydratedModel(filterConfigModel, {
  ...columns
    .filter((column) => column.filterable && column.visible !== false)
    .reduce((acc, column) => {
      acc[column.key as Extract<keyof T, string>] = {
        condition: Array.isArray(column.filterCondition)
          ? null
          : column.filterCondition,
        value: null,
        filterFn: column?.filterFn,
      }
      return acc
    }, {} as FilterConfig<T>),
})

const { filteredData: filteredRows } = useFilter<T>(sortedRows, filterConfig)

// const visibleFilters = ref<Record<Path<T> , boolean> | {}>({});
const visibleFilters = ref<Record<ColumnKey<T>, boolean>>(
  Object.fromEntries(
    columns.map((column) => [column.key, false])
  ) as Record<ColumnKey<T>, boolean>
);

const isFilterVisible = (key: ColumnKey<T>) => {
  return visibleFilters.value[key]
}

const toggleFilterVisibility = (key: ColumnKey<T>, state?: boolean) => {
  state ||= (visibleFilters.value[key] = !visibleFilters.value[key])
  visibleFilters.value[key] = state;
}

const removeFilter = (key: Extract<keyof T, string>) => {
  filterConfig.value[key] = {
    condition: undefined,
    value: null,
  }
}

watch(
  // Watching derived serialized string given object ref mutation does not accurately
  // track old/new values
  () => JSON.stringify(filterConfig.value),
  () => resetPageIfNeeded(),
)
// #endregion

// #region Pagination
const paginationConfigModel = defineModel<PaginationConfig>('paginationConfig', {})

const paginationConfig = useHydratedModel(paginationConfigModel, {
  page: 1,
  perPage: 10,
})

const { paginatedData: visibleRows, resultsCountText } = usePagination<T>(filteredRows, paginationConfig)

const resetPageIfNeeded = () => paginationConfig.value.page !== 1 ? paginationConfig.value.page = 1 : null
// #endregion

// #region Row Details
const { isRowExpanded, toggleRowDetails } = useRowDetailsToggle<string>()
// #endregion

// #region Row Selection
const rowKeys = computed(() => visibleRows.value.map((row) => row[rowKey]))

const selectedRowsModel = defineModel<Set<ColumnKey<T>>>('selectedRows', {})

const selectedRows = useHydratedModel(selectedRowsModel, new Set<ColumnKey<T>>())

const {
  areAllSelected,
  isIndeterminate,
  deselectAll,
  selectAll,
  isSelected,
  toggleSelection
} = useRowSelection<string>(selectedRows)
// #endregion
</script>

<style scoped>
.filter-tag-group-fade-enter-active,
.filter-tag-group-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.filter-tag-group-fade-enter-from,
.filter-tag-group-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.column-filter-popover-fade-enter-active,
.column-filter-popover-fade-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.column-filter-popover-fade-enter-from,
.column-filter-popover-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.details-enter-active,
.details-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}

.details-enter-from,
.details-leave-to {
  max-height: 0;
  opacity: 0;
}

.details-enter-to,
.details-leave-from {
  max-height: max-content;
  opacity: 1;
}
</style>
