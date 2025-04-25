<template>
  <PageBase>
    <template #summary>
      <p class="text-sm opacity-60 max-w-4xl">
        This demo showcases a highly customizable, accessible data table built with Vue 3. 
        It includes support for sorting, filtering, searching, pagination, row selection, expandable details, and slot-based UI overrides - all powered by reusable composables.
      </p>
    </template>
    <TasksDataTable />
  </PageBase>
</template>

<script setup lang="ts">
// Components
import PageBase from '@/components/templates/PageBase.vue'
import TasksDataTable from '@/components/templates/TasksDataTable.vue'
</script>

