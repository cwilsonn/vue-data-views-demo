// Types
import type { FilterGroup } from '@/types/composables/useFilter.types'

/**
 * Props for the `FilterTag` component.
 *
 * These props define the filter data and metadata required to render a filter tag.
 *
 * @template T - The type of the data being filtered.
 */
export type FilterTagProps<T extends Record<string, any>> = {
  /**
   * The key of the data property being filtered.
   */
  filterKey: Extract<keyof T, string>

  /**
   * The filter data for the tag, including the condition, value, and label.
   */
  filter: FilterGroup<T> & {
    /**
     * The label to display for the filter tag.
     */
    label: string

    /**
     * The value formatter for the filter tag, if applicab.e
     */
    filterTagValFormatter?: (value: any) => string
  };
};

/**
 * Emits for the `FilterTag` component.
 *
 * These events allow communication between the `FilterTag` component and its parent.
 */
export type FilterTagEmits = {
  /**
   * Emitted when the filter tag is removed.
   */
  (e: 'remove'): void
};

export type FilterTagSlots<T> = {
  [K in Extract<T, string> as `filterTag-${K}-label`]: {
    /**
     * The original label to display for the filter tag.
     */
    label: string

    /**
     * The currently filtered value.
     */
    value: string | string[] | number | number[] | boolean | Date
  }
}
