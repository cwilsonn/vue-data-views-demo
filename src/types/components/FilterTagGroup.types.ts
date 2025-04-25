// Types
import type { ColumnDefinition } from '@/types/components/DataTable.types'
import type { FilterConfig } from '@/types/composables/useFilter.types'

/**
 * Props for the `FilterTagGroup` component.
 *
 * These props define the columns and filter configuration required to render
 * a group of filter tags.
 *
 * @template T - The type of the data being filtered.
 */
export type FilterTagGroupProps<T extends Record<string, any>> = {
  /**
   * The columns displayed in the table, used to retrieve labels for filters.
   */
  columns: ColumnDefinition<T>[]

  /**
   * The filter configuration for the table, mapping column keys to filter groups.
   */
  filterConfig: FilterConfig<T>

  /**
   * Whether or not to include animations.
   */
  motion?: boolean
};

/**
 * Emits for the `FilterTagGroup` component.
 *
 * These events allow communication between the `FilterTagGroup` component and its parent.
 *
 * @template T - The type of the data being filtered.
 */
export type FilterTagGroupEmits<T extends Record<string, any>> = {
  /**
   * Emitted when a filter tag is removed.
   *
   * @param {keyof T} key - The key of the filter that was removed.
   */
  (e: 'remove', key: Extract<keyof T, string>): void
};
