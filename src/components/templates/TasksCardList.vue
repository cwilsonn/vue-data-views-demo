<template>
  <section class="flex flex-row gap-4 max-w-[60vw]">
    <div class="flex flex-col items-stretch justify-stretch gap-2 max-w-1/4 w-full">
      <form id="tasks-filter-form" @submit.prevent>
        <FormItem
          v-model="searchConfig.query"
          html-for="tasks-search-query"
          label="Search" />
        <FormItem
          :model-value="sortConfig.key"
          html-for="tasks-sort-by"
          label="Sort By"
          type="select"
          :input-props="{ options: sortByOpts }"
          @update:model-value="updateSortKey" />
        <FormItem
          v-model="sortConfig.order"
          html-for="tasks-sort-order"
          label="Sort Order"
          type="select"
          :input-props="{ options: sortOrderOpts }" />
        <FormItem
          :model-value="filterConfig?.status?.value"
          html-for="tasks-filter-status"
          label="Status"
          type="select"
          :input-props="{ options: statusOpts }"
          @update:model-value="(value) => updateFilter({ column: 'status', value })" />
        <FormItem
          :model-value="filterConfig?.priority?.value"
          html-for="tasks-filter-priority"
          label="Priority"
          type="select"
          :input-props="{ options: priorityOpts }"
          @update:model-value="(value) => updateFilter({ column: 'priority', value })" />
        <FormItem
          :model-value="filterConfig?.assigneeName?.value"
          html-for="tasks-filter-assignee-name"
          label="Assignee Name"
          type="select"
          :input-props="{ options: assigneeNameOpts }"
          @update:model-value="(value) => updateFilter({ column: 'assigneeName', value })" />
        <FormItem
          :model-value="filterConfig?.dueDate?.value"
          html-for="tasks-filter-due-date"
          label="Due Date"
          type="calendar"
          class="mb-0!"
          :input-props="{ hideInputIcon: true }"
          @update:model-value="(value) => updateFilter({ column: 'dueDate', value })" />
        <template v-if="hasActiveFilters">
          <hr class="border-gray-300 my-2" />
          <Transition
            name="filter-tag-group-fade"
            mode="out-in">
            <FilterTagGroup
              class="w-full"
              :columns="[
                { key: 'status', label: 'Status' },
                { key: 'priority', label: 'Priority' },
                { key: 'assigneeName', label: 'Assignee Name' },
              ]"
              :filter-config="filterConfig"
              @remove="(key) => clearFilter(key)" />
            </Transition>
        </template>
      </form>
    </div>
    <span class="border-l border-gray-200"></span>
    <div class="flex-grow">
      <span class="text-sm opacity-60">{{ resultsCountText }}</span>
      <PaginationBase
        class="mt-4"
        size="sm"
        :page="paginationConfig.page"
        :per-page="paginationConfig.perPage"
        :total="filteredData.length"
        :disabled="!visibleData.length"
        @update:page="updatePage"
        @update:per-page="updatePerPage" />
      <ul class="list flex flex-col gap-y-4 mt-4">
        <template v-if="visibleData.length">
          <li v-for="entry in visibleData" :key="entry.id">
            <DisplayTaskCard v-bind="entry" />
          </li>
        </template>
        <li v-else>
          <div class="card bg-base-100">
            <div class="card-body">
              <span class="inline-flex items-center gap-x-1 opacity-60 italic mx-auto">
                <Icon icon="tabler:info-circle" />
                No data available
              </span>
            </div>
          </div>
        </li>
      </ul>
      <PaginationBase
        class="mt-6"
        size="sm"
        :page="paginationConfig.page"
        :per-page="paginationConfig.perPage"
        :total="filteredData.length"
        :disabled="!visibleData.length"
        @update:page="updatePage"
        @update:per-page="updatePerPage" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Third-party
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'

// Data
import mockTasks from '@/data/mockTasks.json'

// Types
import {
  type TaskModelFlattened,
  type TaskModel,
  taskStatusLabels,
  taskPriorities,
} from '@/types/models/Task'
import type { SortConfig } from '@/types/composables/useSort.types'
import type { SearchConfig } from '@/types/composables/useSearch.types'
import type { FilterConfig, FilterCondition } from '@/types/composables/useFilter.types'
import type { PaginationConfig } from '@/types/composables/usePagination.types'

// Utils
import { sortLabels } from '@/utils/useSort.util'

// Composables
import { useSort } from '@/composables/useSort'
import { useSearch } from '@/composables/useSearch'
import { useFilter } from '@/composables/useFilter'
import { usePagination } from '@/composables/usePagination'

// Components
import FilterTagGroup from '@/components/molecules/FilterTagGroup.vue'
import FormItem from '@/components/molecules/FormItem.vue'
import PaginationBase from '@/components/molecules/PaginationBase.vue'
import DisplayTaskCard from '@/components/templates/DisplayTaskCard.vue'

const taskData = computed<TaskModelFlattened[]>(() => {
  return mockTasks.map((task) => {
    const { assignee, ...rest } = task as TaskModel
    const flattenedTask: TaskModelFlattened = {
      ...rest,
      assigneeId: task.assignee.id,
      assigneeName: task.assignee.name,
      assigneeEmail: task.assignee.email,
      assigneeIsActive: task.assignee.isActive
    }

    return flattenedTask
  })
})

// #region Search
const searchConfig = ref<SearchConfig<Partial<TaskModelFlattened>>>({
  query: '',
  keys: Object.keys(taskData.value[0]).filter((key) => {
    return ![
      'id',
      'createdAt',
      'updatedAt',
      'assigneeId',
      'assigneeEmail',
      'assigneeIsActive',
    ].includes(key)
  }) as (Extract<keyof TaskModelFlattened, string>)[],
})
const { searchedData } = useSearch<TaskModelFlattened>(taskData, searchConfig)

watch(
  // Watching derived serialized string given object ref mutation does not accurately
  // track old/new values
  () => JSON.stringify(searchConfig.value),
  () => resetPageIfNeeded(),
)
// #endregion

// #region Sort
const sortByOpts = computed(() => ([
  { value: 'title', label: 'Title' }, 
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
  { value: 'assigneeName', label: 'Assignee Name' },
  { value: 'dueDate', label: 'Due Date' },
]))

const sortOrderOpts = computed(() => Object.entries(sortLabels)
  .map(([value, label]) => {
    return {
      value,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    }
  })
)

const sortConfig = ref<SortConfig<TaskModelFlattened>>({
  key: 'dueDate',
  order: 'asc',
})

const { sortedData } = useSort<TaskModelFlattened>(searchedData, sortConfig)

const updateSortKey = (key: Extract<keyof TaskModelFlattened, string>) => {
  if (!key) sortConfig.value.order = null
  sortConfig.value.key = key
}

watch(
  () => `${sortConfig.value.key}:${sortConfig.value.order}`,
  () => resetPageIfNeeded(),
)
// #endregion

// #region Filter
const statusOpts = Object.entries(taskStatusLabels).map(([value, label]) => ({
  value,
  label,
}))

const priorityOpts = Object.keys(taskPriorities).map((priority) => ({
  value: priority,
  label: priority.charAt(0).toUpperCase() + priority.slice(1),
}))

const assigneeNameOpts = computed(() => 
  [...new Set(
    taskData.value.map((task) => ({
      value: task.assigneeName,
      label: task.assigneeName,
    })),
  )]
)

const filterConfig = ref<FilterConfig<TaskModelFlattened>>({
  status: {
    condition: 'eq',
    value: null,
  },
  priority: {
    condition: 'eq',
    value: null,
  },
  assigneeName: {
    condition: 'eq',
    value: null,
  },
})

const { filteredData, clearFilter } = useFilter<TaskModelFlattened>(sortedData, filterConfig)

const hasActiveFilters = computed(() => Object.values(filterConfig.value)
  .some((filter) => filter.value !== null && filter.value !== undefined))

const updateFilter = ({
  column,
  condition,
  value,
}: {
  column: Extract<keyof TaskModelFlattened, string>
  value: string | number | boolean | Date | [Date, Date] | null
  condition?: FilterCondition
}) => {
  if (!column) return
  condition ||= 'eq'

  filterConfig.value[column] = {
    condition: condition || null,
    value,
  }
}

// Watch filterConfig to reset pagination
watch(
  () => JSON.stringify(filterConfig.value),
  () => resetPageIfNeeded(),
)
// #endregion

// #region Pagination
const isPaginating = ref(false)

const paginationConfig = ref<PaginationConfig>({
  page: 1,
  perPage: 5,
})

const { paginatedData: visibleData, resultsCountText } = usePagination<TaskModelFlattened>(filteredData, paginationConfig)

const updatePage = (page: number | undefined) => {
  if (page === undefined) return
  isPaginating.value = true
  paginationConfig.value.page = page

  setTimeout(() => {
    isPaginating.value = false
  }, 300)
}

const updatePerPage = (perPage: number | undefined) => {
  if (perPage === undefined) return
  isPaginating.value = true
  paginationConfig.value.perPage = perPage

  setTimeout(() => {
    isPaginating.value = false
  }, 300)
}

const resetPageIfNeeded = () => paginationConfig.value.page !== 1 ? paginationConfig.value.page = 1 : null
// #endregion
</script>

<style scoped>
.filter-tag-group-fade-enter-active,
.filter-tag-group-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.filter-tag-group-fade-enter-from,
.filter-tag-group-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
