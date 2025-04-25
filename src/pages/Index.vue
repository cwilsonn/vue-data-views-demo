<template>
  <PageBase>
    <template #summary>
      <div class="max-w-3xl">
        <p>Welcome to my Vue 3 composable data views demo! This app showcases reusable Vue 3 composables for searching, sorting, filtering, and paginating datasets.</p>
        <br />
        <p>Explore two different data presentation modes:</p>
        <ul>
          <li>
            <strong class="font-semibold">
              <RouterLink
                :to="{ name: 'DataTableDemo' }"
                class="link">
                DataTable
              </RouterLink>
            </strong>
            - classic tabular layout with dynamic column filters, sortable headers, and row-level interactions.
          </li>
          <li>
            <strong class="font-semibold">
              <RouterLink
                :to="{ name: 'CardListDemo' }"
                class="link">
                CardList
              </RouterLink>
            </strong>
            - simplified list format using the same underlying logic with exposed filter inputs and sort options.
          </li>
        </ul>
        <br />
        <p>All views are powered by the same composable utilities to demonstrate their flexibility across UI patterns.</p>
      </div>
    </template>
  </PageBase>
</template>

<script setup lang="ts">
// Components
import PageBase from '@/components/templates/PageBase.vue'
</script>
