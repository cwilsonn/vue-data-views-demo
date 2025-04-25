<template>
  <LayoutBase>
    <RouterView v-slot="{ Component }">
      <Transition
        name="fade-slide"
        mode="out-in"
        appear>
        <component :is="Component" />
      </Transition>
    </RouterView>
  </LayoutBase>
</template>

<script setup lang="ts">
// Components
import LayoutBase from '@/components/templates/LayoutBase.vue'
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
