<template>
  <div class="form-item mb-3">
    <label v-bind="labelProps">
      <slot
        v-if="label"
        name="label"
        v-bind="labelProps">
        <span>{{ label }}</span>
      </slot>
      <component
        v-if="inputComponent"
        :is="inputComponent"
        v-bind="typedInputProps"
        v-model="value">
      </component>
    </label>
    <ul
      v-if="errors"
      class="mt-1">
      <li
        v-for="(error, index) in errors"
        :key="index"
        class="text-error text-xs">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Third-party
import { computed, defineAsyncComponent } from 'vue';

// Types
import type { FormItemProps } from '@/types/components/FormItem.types';
import type { FormInputProps } from '@/types/components/FormInput.types';
import type { FormSelectProps } from '@/types/components/FormSelect.types';
import type { FormCalendarProps } from '@/types/components/FormCalendar.types';

const {
  label,
  htmlFor,
  errors,
  type = 'input',
  inputProps,
} = defineProps<FormItemProps>();

const value = defineModel('modelValue');

const labelProps = computed(() => ({
  for: htmlFor,
  class: 'floating-label w-full',
}));

const inputComponent = computed(() => {
  switch (type) {
    case 'input':
      return defineAsyncComponent(() => import('@/components/atoms/FormInput.vue'));
    case 'select':
      return defineAsyncComponent(() => import('@/components/atoms/FormSelect.vue'));
    case 'calendar':
      return defineAsyncComponent(() => import('@/components/atoms/FormCalendar.vue'));
    default:
      throw new Error(`[FormItem]: Unsupported form item input component type: ${type}`);
  }
});

const typedInputProps = computed(() => {
  switch (type) {
    case 'input': {
      const inputPropsTyped = inputProps as FormInputProps; // Narrow the type
      return {
        ...inputPropsTyped,
        id: inputPropsTyped?.id ?? htmlFor,
        placeholder: inputPropsTyped?.placeholder ?? label,
      };
    }
    case 'select': {
      const selectPropsTyped = inputProps as FormSelectProps; // Narrow the type
      return {
        ...selectPropsTyped,
        id: selectPropsTyped?.id ?? htmlFor,
      };
    }
    case 'calendar': {
      const calendarPropsTyped = inputProps as FormCalendarProps; // Narrow the type
      return {
        ...calendarPropsTyped,
        id: calendarPropsTyped?.id ?? htmlFor,
        placeholder: calendarPropsTyped?.placeholder ?? label,
      };
    }
    default:
      throw new Error(`[FormItem]: Unsupported form item input component type: ${type}`);
  }
});
</script>
