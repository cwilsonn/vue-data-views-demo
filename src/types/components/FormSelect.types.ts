// Types
import type { FormInputProps } from '@/types/components/FormInput.types';

/**
 * Props for the FormSelect component.
 *
 * This type extends the base FormInputProps, omitting properties
 * that are not applicable to a select input (e.g., `type` and `placeholder`),
 * and includes additional options specific to the select input functionality.
 */
export type FormSelectProps = Omit<FormInputProps, 'type' | 'placeholder'> & {
  /**
   * The default option to display at the top of the dropdown.
   *
   * If set to a string, it will be displayed as the default option.
   * If set to `false`, no default option will be displayed.
   *
   * Example: 'Select an option'
   */
  defaultOption?: string | false;

  /**
   * The list of options available in the select dropdown.
   *
   * Options can be provided in one of the following formats:
   * - An array of objects with `label` and `value` properties.
   * - A simple array of strings, numbers, or booleans.
   *
   * Example:
   * ```typescript
   * options: [
   *   { label: 'Option 1', value: 1 },
   *   { label: 'Option 2', value: 2, disabled: true },
   *   'Option 3',
   *   4,
   *   true
   * ]
   * ```
   */
  options:
    | {
        label: string;
        value: string | number | boolean;
        disabled?: boolean;
      }[]
    | string[]
    | number[]
    | boolean[];
};
