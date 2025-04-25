<template>
  <div class="layout-container layout--base">
    <AppHeader />
    <AppMainContent>
      <slot />
    </AppMainContent>
  </div>
</template>

<script setup lang="ts">
// Components
import AppHeader from '@/components/AppHeader.vue'
import AppMainContent from '@/components/AppMainContent.vue'
</script>
