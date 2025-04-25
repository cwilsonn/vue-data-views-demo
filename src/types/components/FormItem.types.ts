// Types
import type { FormInputProps } from '@/types/components/FormInput.types'
import type { FormSelectProps } from '@/types/components/FormSelect.types'
import type { FormCalendarProps } from '@/types/components/FormCalendar.types'

export const formItemType = {
  input: 'input',
  select: 'select',
  calendar: 'calendar',
} as const

/**
 * Utility type to make `id` optional in child components of FormItem.
 */
export type OptionalId<T> = Omit<T, 'id'> & { id?: string }

export type FormItemType = keyof typeof formItemType

/**
 * Shared props for the `FormItem` component.
 */
export type FormItemSharedProps = {
  /**
   * The label for the form item.
   */
  label?: string

  /**
   * The `htmlFor` attribute for the associated input element.
   */
  htmlFor: string

  /**
   * The errors associated with the form item.
   */
  errors?: string[]
};

/**
 * Props for the `FormItem` component.
 *
 * The `inputProps` type is conditional based on the `type` property:
 * - If `type` is `'input'`, `inputProps` must be `FormInputProps`.
 * - If `type` is `'select'`, `inputProps` must be `FormSelectProps`.
 * - If `type` is `'calendar'`, `inputProps` must be `FormCalendarProps`.
 */
export type FormItemProps =
  | (FormItemSharedProps & {
      type?: 'input'
      inputProps?: OptionalId<FormInputProps>
    })
  | (FormItemSharedProps & {
      type: 'select'
      inputProps?: OptionalId<FormSelectProps>
    })
  | (FormItemSharedProps & {
      type: 'calendar'
      inputProps?: OptionalId<FormCalendarProps>
    });
