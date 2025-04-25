<template>
  <article :class="`page page--${String(route.name)}`">
    <header class="mb-8">
      <h1 class="page__title text-3xl font-semibold mb-4">
        <slot
          name="title-icon"
          v-bind="{ icon: pageIcon }">
          <Icon
            v-if="typeof pageIcon === 'string'"
            :icon="pageIcon"
            class="page__title-icon inline text-secondary me-1"
            :inline="true" />
        </slot>
        <span class="page__title-text">
          <slot
            name="title-text"
            v-bind="{ title: pageTitle }">
            {{ pageTitle }}
          </slot>
        </span>
      </h1>
      <slot name="summary"></slot>
    </header>
    <section class="page__content my-4">
      <slot />
    </section>
  </article>
</template>

<script setup lang="ts">
// Third-party
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import type { PageBaseProps, PageBaseSlots } from '@/types/components/PageBase.types';

const {
  title,
  icon,
} = defineProps<PageBaseProps>()

const slots = defineSlots<PageBaseSlots>()

const route = useRoute()

const pageTitle = computed(() => title || route.meta.title)
const pageIcon = computed(() => icon || route.meta.icon)
</script>
