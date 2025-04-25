<template>
  <!-- v-model:filter-config="filterConfig" -->
  <DataTable
    :id="tableId"
    v-model:sort-config="sortConfig"
    v-model:filter-config="filterConfig"
    :columns="tableColumns"
    :rows="tableRows"
    row-key="id"
    size="sm"
    striped
    fixed>
    <template #cell-status="{ value }: { value: TaskStatus }">
      <span :class="`badge badge-soft badge-sm ${taskStatusBadgeColorMap[value]}`">
        {{ taskStatusLabels[value] }}
      </span>
    </template>
    <template #cell-priority="{ value }: { value: TaskPriority }">
      <span :class="`badge badge-soft badge-sm ${taskPriorityBadgeColorMap[value]}`">
        {{ value.charAt(0).toUpperCase() + value.slice(1) }}
      </span>
    </template>
    <template #cell-tags="{ value }: { value: string[] }">
      <ul
        v-if="value?.length"
        class="flex flex-row flex-wrap gap-x-1 gap-y-2">
        <li
          v-for="tag in value"
          :key="tag">
          <span class="badge badge-sm badge-soft badge-neutral">
            {{ tag }}
          </span>
        </li>
      </ul>
    </template>
    <template #details="{ row: { title, description, dueDate, updatedAt, createdAt } }: { row: TaskModelFlattened }">
      <DisplayTaskCard v-bind="{ title, description, dueDate, updatedAt, createdAt }" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
// Third-party
import { ref, computed } from 'vue'

// Data
import mockTasks from '@/data/mockTasks.json'

// Types
import {
  type TaskModelFlattened,
  type TaskModel,
  type TaskStatus,
  type TaskPriority,
  taskPriorities,
  taskStatuses,
  taskStatusLabels,
  taskPriorityBadgeColorMap,
  taskStatusBadgeColorMap,
} from '@/types/models/Task'
import type { SortConfig } from '@/types/composables/useSort.types'
import type { FilterConfig } from '@/types/composables/useFilter.types'
import type { ColumnDefinition } from '@/types/components/DataTable.types'

// Composables
import { useId } from '@/composables/useId'

// Components
import DataTable from '@/components/organisms/DataTable.vue'
import DisplayTaskCard from '@/components/templates/DisplayTaskCard.vue'

// #region Sort
const sortConfig = ref<SortConfig<TaskModelFlattened>>({
  key: 'dueDate',
  order: 'asc',
})
// #endregion

// #region Filter
const filterConfig = ref<FilterConfig<TaskModelFlattened>>({
  dueDate: {
    condition: null,
    value: null,
  }
})
// #endregion

// #region Table
// Flattened task data for use within the DataTable component
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

const tableId = useId('demo-users-table')
const tableRows = computed<TaskModelFlattened[]>(() => taskData.value)

const tableColumns = computed<ColumnDefinition<TaskModelFlattened>[]>(() => ([
  { key: '_select' },
  { key: 'id', label: 'ID', visible: false },
  { key: 'title', label: 'Title', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    filterCondition: 'eq',
    filterOptions: Object.keys(taskStatuses).map(status => ({
      label: taskStatusLabels[status as keyof typeof taskStatusLabels],
      value: status,
    })),
    filterTagValFormatter: (value: string) =>
      taskStatusLabels[value as keyof typeof taskStatusLabels],
    tdProps: { class: 'w-20' },
  },
  {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    filterable: true,
    filterCondition: 'eq',
    filterOptions: Object.keys(taskPriorities).map(priority => ({
      label: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: priority,
    })),
    filterTagValFormatter: (value: string) =>
      value.charAt(0).toUpperCase() + value.slice(1),
    tdProps: { class: 'w-20' },
  },
  {
    key: 'assigneeName',
    label: 'Assignee',
    sortable: true,
    filterable: true,
    filterCondition: 'eq',
    filterOptions: [...new Set(taskData.value.map(task => task.assigneeName))]
      .map(name => ({
        label: name,
        value: name,
      })),
  },
  {
    key: 'dueDate',
    label: 'Due Date',
    formatter: (value: Date) => new Date(value).toISOString().split('T')[0],
    type: 'date',
    sortable: true,
    filterable: true,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'text',
    sortable: false,
    filterable: true,
    filterCondition: 'in',
    filterOptions: [...new Set(taskData.value.flatMap(task => task.tags))]
      .filter(tag => tag !== null && tag !== undefined)
      .sort((a, b) => {
        if (!a || !b) return 0
        return a.localeCompare(b)
      })
      .map(tag => ({
        label: tag,
        value: tag,
      })),
  },
  { key: '_expand', label: 'Details' },
]))
// #endregion
</script>
