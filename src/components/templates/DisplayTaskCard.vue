<template>
  <article class="card card--task bg-base-100 shadow-sm">
    <div class="card-body">
      <header>
        <h2 class="card-title mb-0">{{ title }}</h2>
        <span v-if="dueDate" aria-label="Due date" class="inline-flex items-center gap-x-1 opacity-60">
          <Icon icon="tabler:calendar" />
          Due on {{ formatDate(dueDate) }}
        </span>
      </header>
      <ul class="list flex flex-col gap-y-1">
        <li v-if="status">
          <strong class="font-semibold me-2">Status</strong>
          <span :class="`badge badge-sm badge-soft ${taskStatusBadgeColorMap[status]}`">
            {{ taskStatusLabels[status] }}
          </span>
        </li>
        <li v-if="priority">
          <strong class="font-semibold me-2">Priority</strong>
          <span :class="`badge badge-sm badge-soft ${taskPriorityBadgeColorMap[priority]}`">
            {{ priority.charAt(0).toUpperCase() + priority.slice(1) }}
          </span>
        </li>
        <li v-if="assigneeName">
          <strong class="font-semibold me-2">Assignee</strong>
          {{ assigneeName }}
          <a
            v-if="assigneeEmail"
            :href="`mailto:${assigneeEmail}`"
            class="link opacity-60 text-xs">
            ({{ assigneeEmail }})
          </a>
        </li>
        <li v-if="tags">
          <strong class="font-semibold me-2">Tags</strong>
          <ul class="inline-flex flex-row flex-wrap gap-1">
            <li
              v-for="tag in tags"
              :key="tag">
              <span class="badge badge-sm badge-soft badge-neutral">
                {{ tag }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
      <p>{{ description }}</p>
      <footer class="text-xs flex flex-row content-end gap-x-1 opacity-60">
        <span v-if="updatedAt">Last updated {{ formatDate(updatedAt) }}</span>
        |
        <span v-if="createdAt">Created on {{ formatDate(createdAt) }}</span>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
// Third-party
import { Icon } from '@iconify/vue'

// Types
import {
  type TaskModelFlattened,
  taskStatusLabels,
  taskPriorityBadgeColorMap,
  taskStatusBadgeColorMap,
} from '@/types/models/Task'

const {
  title,
  description,
  priority,
  status,
  dueDate,
  createdAt,
  updatedAt,
  tags,
  assigneeName,
  assigneeEmail,
} = defineProps<Partial<TaskModelFlattened>>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
</script>
