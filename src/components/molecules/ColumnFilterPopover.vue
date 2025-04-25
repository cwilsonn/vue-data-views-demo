<template>
  <OnClickOutside
    class="column-filter-popover"
    @trigger="() => emit('close')">
    <slot
      name="filter"
      v-bind="{ column, filterConfig }">
      <slot
        :name="`filter-${String(column.key)}`"
        v-bind="{ column, filterConfig }">
        <FormItem
          v-if="Array.isArray(column.filterCondition)"
          :model-value="filterConfig.condition ?? undefined"
          :html-for="`filter-condition:${String(column.key)}`"
          label="Condition"
          class="min-w-24 w-auto!"
          type="select"
          :input-props="filterConditionInputProps"
          @update:model-value="(value: FilterCondition) => updateFilter({
            column,
            condition: value,
            value: filterConfig.value,
          })"
        />
        <div class="form-item">
          <label
            :for="labelForValue"
            class="floating-label">
            <span>{{ column.label }}</span>
            <input
              v-if="isPlainSingleInput"
              :id="`filter:${String(column.key)}`"
              class="input input-sm min-w-48 max-w-none"
              :type="column.type"
              :value="filterConfig.value"
              @input="(event: Event) => updateFilter({
                column,
                condition: filterConfig.condition || 'eq',
                value: (event.target as HTMLInputElement).value
              })" />
            <VueDatePicker
              v-else-if="column.type === 'date'"
              :uid="`filter:${String(column.key)}`"
              class="input input-sm min-w-48 max-w-none"
              :model-value="filterConfig.value"
              format="yyyy/MM/dd"
              :placeholder="column.label"
              hide-input-icon
              model-auto
              range
              @update:model-value="(value: Date | [Date, Date]) => updateFilter({
                column,
                condition: Array.isArray(value) ? 'between' : filterConfig.condition || 'eq',
                value,
              })" />
            <select
              v-if="column.filterOptions?.length"
              :id="`filter:${String(column.key)}`"
              class="select select-sm min-w-48 max-w-none"
              :value="filterConfig.value"
              @change="(event: Event) => updateFilter({
                column,
                condition: filterConfig.condition || 'eq',
                value: (event.target as HTMLSelectElement).value
              })">
              <option value="" selected>All</option>
              <option
                v-for="option in column.filterOptions"
                :key="String(option.value)"
                :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>
        <button
          class="btn btn-soft btn-neutral btn-xs btn-block mt-2"
          @click="updateFilter({
            column,
            condition: null,
            value: null,
          })">
          <Icon icon="tabler:x" />
          Clear filter
        </button>
      </slot>
    </slot>
  </OnClickOutside>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
// Third-party
import { computed } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import { Icon } from '@iconify/vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Types
import {
  type FilterGroup,
  type FilterCondition,
} from '@/types/composables/useFilter.types'
import type {
  ColumnFilterPopoverSharedProps,
  ColumnFilterPopoverSlots,
  ColumnFilterPopoverEmits,
} from '@/types/components/ColumnFilterPopover.types'
import type { ColumnDefinition } from '@/types/components/DataTable.types'
import type { OptionalId } from '@/types/components/FormItem.types'
import type { FormSelectProps } from '@/types/components/FormSelect.types'

// Utils
import { filterConditions, filterConditionLabels } from '@/utils/useFilter.util'

// Composables
import { useHydratedModel } from '@/composables/useHydratedModel'

// Components
import FormItem from '@/components/molecules/FormItem.vue'

const {
  column
} = defineProps<ColumnFilterPopoverSharedProps<T>>()

const slots = defineSlots<ColumnFilterPopoverSlots<T>>()
const emit = defineEmits<ColumnFilterPopoverEmits<T>>()
const externalFilterConfig = defineModel<FilterGroup<T>>('filterConfig', {
  default: () => ({
    condition: null,
    value: null,
  }),
})

// NOTE TO CHATGPT: These are the approaches that I've tried:
// syncRef(externalFilterConfig, filterConfig, { direction: 'rtl' })
const filterConfig = useHydratedModel<FilterGroup<T>>(externalFilterConfig, {})

/**
 * VueDatePicker adds a prefix to the input ID, so we need to adjust the label's `for` attribute accordingly.
 * @returns {string} - The ID for the label element, adjusted for VueDatePicker if applicable.
 */
const labelForValue = computed(() => column.type === 'date'
  ? `dp-input-filter:${String(column.key)}`
  : `filter:${String(column.key)}`)

/**
 * Used to determine if the filter is a plain, single <input/> element.
 * @returns {boolean}
 */
const isPlainSingleInput = computed(() => {
  return column.type && ['text', 'number'].includes(column.type) && !column.filterOptions
})

// Generates the input props for the filter condition FormItem
const filterConditionInputProps = computed<OptionalId<FormSelectProps>>(() => {
  if (!Array.isArray(column.filterCondition)) {
    return {
      size: 'sm',
      options: [],
    }
  }

  return {
    size: 'sm',
    options: column.filterCondition?.map(condition => {
      if (typeof condition === 'string' && condition in filterConditions) {
        return {
          label: filterConditionLabels[condition],
          value: filterConditions[condition],
        };
      }
      return { label: '', value: '' };
    }) ?? [],
  }
})

/**
 * Converts the input value to the appropriate type based on the column's type, condition, value, and filterConfig.
 * This ensures the filter logic works correctly for boolean, text, and number types.
 * 
 * @param {ColumnDefinition<T>} column - The column object containing the type and filter options.
 * @param {any} value - The input value to be converted.
 * @param {FilterCondition} condition - The condition used for filtering.
 * @returns {any} - The converted value based on the column type and condition.
 */
const getFinalFilterValue = (column: ColumnDefinition<T>, value: any, condition?: FilterCondition) => {
  if (!value || !condition) return null

  console.log(`getting final filter value for column: ${column.key}, condition: ${condition}, value: ${value}, value type: ${typeof value}, value is date? ${value instanceof Date}`)

  switch (column.type) {
    case 'date': {
      if (value instanceof Date) {
        return value.toISOString().split('T')[0]
      }
      if (Array.isArray(value)) {
        return value.map(v =>
          v instanceof Date ? v.toISOString().split('T')[0] : v
        )
      }
      return value
    }
    case 'boolean':
      return value === 'true' ? true : value === 'false' ? false : null
    case 'text':
      return String(value)
    case 'number':
      return Number(value)
    default:
      return value
  }
}

/**
 * Handles the update of the filter configuration based on the selected column, condition, and value.
 * 
 * @param {Object} params - The parameters for the filter update.
 * @param {ColumnDefinition<T>} params.column - The column object to be filtered.
 * @param {FilterCondition} [params.condition] - The condition used for filtering.
 * @param {string | number | boolean | Date | [Date, Date] | null} params.value - The value to filter by.
 * @returns {void}
 */
const updateFilter = ({
  column = null,
  condition = null,
  value = null,
}: {
  column: ColumnDefinition<T> | null
  condition?: FilterCondition
  value: string | number | boolean | Date | [Date, Date] | null
}) => {
  if (!column) return

  // Determine the final value based on the column type and the provided value
  const finalValue = getFinalFilterValue(column, value, condition)

  filterConfig.value = {
    condition,
    value: finalValue,
  }
}
</script>

<style>
/* Overrides to VueDatePicker input styles to make it get along with DaisyUI input styles */
.dp__input {
  border: none;
  padding: 0;
  font-size: 0.75rem;
}

.dp__outer_menu_wrap.dp--menu-wrapper {
  top: 38px !important; /* Overriding inline style on this element for appropriate positioning */
}
</style>
