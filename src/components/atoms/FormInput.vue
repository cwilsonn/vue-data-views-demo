<template>
  <input v-bind="inputProps" v-model="value" />
</template>

<script setup lang="ts">
// Third-party
import { computed } from 'vue'

// Types
import type { FormInputProps } from '@/types/components/FormInput.types'

const {
  id,
  name,
  placeholder,
  type = 'text',
  size = 'md',
  required = false,
  disabled = false,
} = defineProps<FormInputProps>()

const value = defineModel('modelValue');

const inputSizeClassMap = {
  xs: 'input-xs',
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
  xl: 'input-xl',
}

const inputProps = computed(() => ({
  id,
  name,
  type,
  placeholder,
  class: ['input', inputSizeClassMap[size], { 'input-disabled': disabled }],
  required,
  disabled,
}))
</script>
