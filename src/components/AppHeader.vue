<template>
  <header
    id="app-header"
    class="bg-base-100 shadow-md border-b-base-200">
    <div class="container mx-auto p-4 flex items-center justify-between">
      <RouterLink
        class="text-xl font-semibold"
        to="/">
        <Icon
          icon="tabler:layout-dashboard"
          class="inline text-primary"
          :inline="true"  />
        <span>Data Views Demo</span>
      </RouterLink>
      <nav id="main-nav">
        <ul class="list-none flex items-centfer gap-4 p-4 text-sm">
          <li
            v-for="route in routes"
            :key="route.title"
            class="font-semibold">
            <RouterLink
              :to="route.to"
              class="link inline-flex items-center gap-1"
              :class="{
                'text-primary hover:text-primary-focus': $route.name === route.to.name,
              }">
              <Icon
                v-if="route.icon"
                :icon="route.icon"
                class="inline"
                :inline="true" />
              {{ route.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Third-party
import { Icon } from '@iconify/vue'

const routes = [
  {
    title: 'Data Table',
    to: { name: 'DataTableDemo' },
    icon: 'tabler:table',
  },
  {
    title: 'Card List',
    to: { name: 'CardListDemo' },
    icon: 'tabler:layout-list',
  },
]
</script>
