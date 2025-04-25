<template>
  <select v-bind="selectProps" v-model="value">
    <option
      v-if="!required || defaultOption === false"
      :value="null"
      selected>
      {{ defaultOption }}
    </option>
    <option
      v-for="option in options"
      :key="getOptionKey(option)"
      :value="getOptionValue(option)">
      {{ getOptionLabel(option) }}
    </option>
  </select>
</template>

<script setup lang="ts">
// Third-party
import { computed } from 'vue'

// Types
import type { Unbox } from '@/types/util/unbox'
import type { FormSelectProps } from '@/types/components/FormSelect.types'

const {
  id,
  name,
  size = 'md',
  defaultOption = 'Select an option',
  options = [],
  required = false,
  disabled = false,
} = defineProps<FormSelectProps>()

const value = defineModel('modelValue')

const selectSizeClassMap = {
  xs: 'select-xs',
  sm: 'select-sm',
  md: 'select-md',
  lg: 'select-lg',
  xl: 'select-xl',
}

const selectProps = computed(() => ({
  id,
  name,
  class: ['select', selectSizeClassMap[size], { 'select-disabled': disabled }],
  required,
  disabled,
}))

const getOptionKey = (option: Unbox<FormSelectProps['options']>) => {
  if (typeof option === 'object') {
    return typeof option.value === 'boolean' ? String(option.value) : option.value 
  }

  return typeof option === 'boolean' ? String(option) : option;
}

const getOptionValue = (option: Unbox<FormSelectProps['options']>) => {
  if (typeof option === 'object') {
    return option.value
  }

  return option
}

const getOptionLabel = (option: Unbox<FormSelectProps['options']>) => {
  if (typeof option === 'object') {
    return option.label
  }

  return option
}
</script>
