<template>
  <VueDatePicker
    v-model="value"
    v-bind="calendarProps" />
</template>

<script setup lang="ts">
// Third-party
import { computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// Types
import type { FormCalendarProps } from '@/types/components/FormCalendar.types'

const {
  id,
  name,
  size = 'md',
  placeholder = 'Select a date',
  format = 'MM/dd/yyyy',
  required = false,
  disabled = false,
  range = false,
  modelAuto = false,
  hideInputIcon = false,
} = defineProps<FormCalendarProps>()

const value = defineModel<Date>('modelValue')

const calendarSizeClassMap = {
  xs: 'input-xs',
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
  xl: 'input-xl',
}

const calendarProps = computed(() => ({
  uid: id,
  name,
  class: ['input', calendarSizeClassMap[size], { 'input-disabled': disabled }],
  placeholder,
  format,
  modelAuto,
  hideInputIcon,
  range,
  disabled,
  required,
}))
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
