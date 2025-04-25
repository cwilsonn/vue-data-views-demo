// Types
import type { FormInputProps } from '@/types/components/FormInput.types'

/**
 * Props for the FormCalendar component.
 *
 * This type extends the base FormInputProps and includes additional
 * options specific to the calendar input functionality.
 */
export type FormCalendarProps = FormInputProps & {
  /**
   * The format of the date displayed in the input.
   *
   * Example: 'YYYY-MM-DD' or 'MM/DD/YYYY'
   */
  format?: string

  /**
   * Whether the calendar supports selecting a range of dates.
   *
   * If true, the user can select a start and end date.
   */
  range?: boolean

  /**
   * Whether the model should automatically update when the user interacts
   * with the calendar.
   *
   * If true, the model will update without requiring explicit confirmation.
   */
  modelAuto?: boolean

  /**
   * Whether to hide the input icon (e.g., a calendar icon).
   *
   * If true, the input field will not display an icon.
   */
  hideInputIcon?: boolean
}
