<template>
  <PageBase>
    <template #summary>
      <p class="text-sm opacity-60 max-w-4xl">
        This demo presents an alternative data view using a card list layout. It demonstrates how the same sorting, searching, filtering, and pagination composables can be applied outside of tabular UIs, offering a flexible and accessible approach to list-based data presentation.
        <br />
        The Card List uses standard form inputs for filter controls, showcasing a more exposed and immediately interactive UI compared to the table's header-based filter popovers.
      </p>
    </template>
    <TasksCardList />
  </PageBase>
</template>

<script setup lang="ts">
// Components
import PageBase from '@/components/templates/PageBase.vue'
import TasksCardList from '@/components/templates/TasksCardList.vue'
</script>
