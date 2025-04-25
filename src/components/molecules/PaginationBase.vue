<template>
  <div class="pagination-container">
    <nav
      class="flex flex-wrap items-center justify-between gap-x-2"
      aria-label="Pagination">
      <FormItem
        v-if="dynamicPerPage"
        v-model="perPage"
        :html-for="perPageId"
        label="Per page"
        class="min-w-24 w-auto! mb-0!"
        type="select"
        :input-props="{
          size,
          disabled,
          required: true,
          options: [5, 10, 25, 50, 75, 100]
        }"
        @update:model-value="currentPage = 1"
      />
      <ul class="flex items-center">
        <li v-if="showFirstLast">
          <button 
            :class="[sharedButtonClasses, 'rounded-none rounded-l', {
              'btn-disabled': currentPage === 1 || disabled,
            }]"
            :aria-current="currentPage === 1 ? 'page' : undefined"
            :disabled="currentPage === 1" 
            title="Go to first page" 
            @click="currentPage = 1">
            <span class="sr-only">Go to first page</span>
            <slot name="first"> &laquo; </slot>
          </button>
        </li>
        <li v-if="showPrevNext">
          <button 
            :class="[sharedButtonClasses, 'rounded-none', {
              'btn-disabled': currentPage === 1 || disabled,
            }]"
            :disabled="currentPage === 1"
            title="Go to previous page"
            @click="currentPage -= 1">
            <span class="sr-only">Go to previous page</span>
            <slot name="prev"> &lsaquo; </slot>
          </button>
        </li>
        <li
          v-for="button in pagesWindow"
          :key="`page-${button}`">
          <button
            :class="[sharedButtonClasses, 'rounded-none', {
              'btn-active': currentPage === button,
              'btn-disabled': disabled,
            }]"
            :title="`Go to page ${button}`"
            @click="currentPage = button">
            {{ button }}
          </button>
        </li>
        <li v-if="showPrevNext">
          <button
            :class="[sharedButtonClasses, 'rounded-none', {
              'btn-disabled': currentPage === totalPages || disabled,
            }]"
            :disabled="currentPage === totalPages"
            title="Go to next page"
            @click="currentPage += 1">
            <span class="sr-only">Go to next page</span>
            <slot name="next"> &rsaquo; </slot>
          </button>
        </li>
        <li v-if="showFirstLast">
          <button
            :class="[sharedButtonClasses, 'rounded-none rounded-r', {
              'btn-disabled': currentPage === totalPages || disabled,
            }]"
            :disabled="currentPage === totalPages"
            title="Go to last page"
            @click="currentPage = totalPages">
            <span class="sr-only">Go to last page</span>
            <slot name="last"> &raquo; </slot>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
// Third-party
import { computed, watch } from 'vue'

// Types
import type { PaginationBaseSharedProps } from '@/types/components/PaginationBase.types'

// Composables
import { useId } from '@/composables/useId'
import { useHydratedModel } from '@/composables/useHydratedModel'

// Components
import FormItem from '@/components/molecules/FormItem.vue'

const {
  total,
  showFirstLast = true,
  showPrevNext = true,
  dynamicPerPage = true,
  disabled = false,
  maxButtons = 5,
  size = 'md',
} = defineProps<PaginationBaseSharedProps>()

const perPageId = useId('pagination')

const currentPageModel = defineModel<number>('page', {})
const currentPage = useHydratedModel(currentPageModel, 1)

const perPageModel = defineModel<number>('perPage', {})
const perPage = useHydratedModel(perPageModel, 10)

// Computes the total number of pages based on the total items and items per page
const totalPages = computed(() => Math.ceil(total / perPage.value))

// Computes the range of page numbers to display in the pagination window
const pagesWindow = computed(() => {
  const windowSize = Math.min(totalPages.value, maxButtons)
  const halfWindow = Math.floor(windowSize / 2)
  let start = Math.max(currentPage.value - halfWindow, 1)
  let end = start + windowSize - 1

  if (end > totalPages.value) {
    end = totalPages.value
    start = Math.max(end - windowSize + 1, 1)
  }

  return Array.from({ length: windowSize }, (_, i) => start + i)
});

// The shared button classes
const sharedButtonClasses = computed(() => ({
  'btn btn-neutral btn-soft': true,
  'btn-xs': size === 'xs',
  'btn-sm': size === 'sm',
  'btn-md': size === 'md',
  'btn-lg': size === 'lg',
  'btn-xl': size === 'xl',
  'btn-disabled': disabled,
}))

// Ensure currentPage doesn't exceed totalPages
watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = newTotalPages
  }
})
</script>
