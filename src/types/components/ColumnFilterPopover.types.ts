// Types
import type { ColumnDefinition } from '@/types/components/DataTable.types'
import type { FilterConfig } from '@/types/composables/useFilter.types'

/**
 * Shared props for the `ColumnFilterPopover` component.
 *
 * These props are required for the component to function and are shared
 * between internal and public usage.
 *
 * @template T - The type of the data being filtered.
 */
export type ColumnFilterPopoverSharedProps<T extends Record<string, any>> = {
  /**
   * The column for which the filter popover is being displayed.
   */
  column: ColumnDefinition<T>

  /**
   * Whether or not to include animations.
   */
  motion?: boolean
}

/**
 * Public props for the `ColumnFilterPopover` component.
 *
 * These props include the shared props and additional configuration
 * for managing the filter state.
 *
 * @template T - The type of the data being filtered.
 */
export type ColumnFilterPopoverPublicProps<T extends Record<string, any>> =
  ColumnFilterPopoverSharedProps<T> & {
    /**
     * The filter configuration for the column.
     */
    filterConfig: FilterConfig<T>
  }

/**
 * Slots available in the `ColumnFilterPopover` component.
 *
 * These slots allow customization of the filter UI and behavior.
 *
 * @template T - The type of the data being filtered.
 */
export type ColumnFilterPopoverSlots<T extends Record<string, any>> = {
  /**
   * Slot for customizing the filter UI for the column.
   */
  filter: {
    column: ColumnDefinition<T>
    filterConfig: FilterConfig<T>
  }
} & {
  /**
   * Dynamic slots for customizing the filter UI for specific columns.
   * The slot name is dynamically generated based on the column key.
   */
  [K in `filter-${string}`]: {
    column: ColumnDefinition<T>
    filterConfig: FilterConfig<T>
  }
}

/**
 * Emits available in the `ColumnFilterPopover` component.
 *
 * These events allow communication between the component and its parent.
 *
 * @template T - The type of the data being filtered.
 */
export type ColumnFilterPopoverEmits<T extends Record<string, any>> = {
  /**
   * Emitted when the popover is closed.
   */
  (e: 'close'): void

  /**
   * Emitted when the filter configuration is updated.
   *
   * @param {FilterConfig<T>} value - The updated filter configuration.
   */
  (e: 'update:filterConfig', value: FilterConfig<T>): void
}
