// Types
import type { FilterCondition } from '@/types/composables/useFilter.types.ts'
import type { SearchConfig } from '@/types/composables/useSearch.types'
import type { SortConfig } from '@/types/composables/useSort.types'
import type { FilterConfig } from '@/types/composables/useFilter.types.ts'
import type { PaginationConfig } from '@/types/composables/usePagination.types'

/**
 * Available column data types for the DataTable.
 */
export const columnDataTypes = {
  text: 'text',
  number: 'number',
  boolean: 'boolean',
  date: 'date',
} as const

/**
 * Type representing the available column data types.
 */
export type ColumnDataType = keyof typeof columnDataTypes

/**
 * Special-purpose keys for enabling additional functionality in the DataTable.
 *
 * These keys can be passed by the user to dynamically add features such as
 * row selection or row details expansion.
 */
export const specialPurposeColumnKeys = {
  _select: '_select',
  _expand: '_expand',
} as const;

/**
 * Type representing the special-purpose keys used in the DataTable.
 */
export type SpecialPurposeColumnKey = keyof typeof specialPurposeColumnKeys;

/**
 * Type representing the key of a column in the DataTable.
 *
 * This includes both keys from the data model and special-purpose keys.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type ColumnKey<T> = Extract<keyof T, string> | SpecialPurposeColumnKey;

/**
 * Definition of a column in the DataTable.
 *
 * This type includes configuration options for rendering, filtering, sorting,
 * and other behaviors associated with a column.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type ColumnDefinition<T extends Record<string, any>> = {
  /**
   * The unique key for the column.
   */
  key: ColumnKey<T>

  /**
   * The label to display in the column header.
   */
  label?: string

  /**
   * Tooltip text for the column header.
   */
  tooltip?: string

  /**
   * The data type of the column (e.g., text, number, boolean, date).
   */
  type?: ColumnDataType

  /**
   * Whether the column is visible.
   */
  visible?: boolean

  /**
   * Attributes to apply to the `<th>` element for the column header.
   */
  thAttrs?: Record<string, any>

  /**
   * Attributes to apply to the `<td>` elements for the column cells.
   */
  tdAttrs?: Record<string, any>

  /**
   * A function to format the cell value for display.
   *
   * @param value - The raw value of the cell.
   * @param row - The row object containing the cell.
   * @returns {string} - The formatted value.
   */
  formatter?: (value: any, row: T) => string

  /**
   * Whether the column is searchable.
   */
  searchable?: boolean

  /**
   * Whether the column is sortable.
   */
  sortable?: boolean

  /**
   * A custom sorting function for the column.
   *
   * @param a - The first row to compare.
   * @param b - The second row to compare.
   * @returns {number} - A negative number if `a` should come before `b`, a positive number if `b` should come before `a`, or `0` if they are equal.
   */
  sortFn?: (a: T, b: T) => number

  /**
   * Whether the column is filterable.
   */
  filterable?: boolean

  /**
   * A custom filtering function for the column.
   *
   * @param item - The row object to evaluate.
   * @returns {boolean} - `true` if the row matches the filter, `false` otherwise.
   */
  filterFn?: (item: T) => boolean

  /**
   * The filter condition(s) to apply to the column.
   */
  filterCondition?: FilterCondition | FilterCondition[]

  /**
   * Options for filtering the column.
   */
  filterOptions?: {
    label: string
    value: string | number | boolean | Date
  }[]

  /**
   * Additional props to pass to the filter component for the column.
   */
  filterProps?: Record<string, any>

  /**
   * A function to format the filter tag value for display.
   *
   * @param label - The label of the filter option.
   * @param value - The value of the filter option.
   * @returns {string} - The formatted value.
   */
  filterTagValFormatter?: (label: string, value: any) => string
}

/**
 * Shared props for the DataTable component.
 *
 * These props are required for the component to function and are shared
 * between internal and public usage.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type DataTableSharedProps<T extends Record<string, any>> = {
  /**
   * The unique ID for the DataTable instance.
   */
  id: string

  /**
   * The columns to display in the DataTable.
   */
  columns: ColumnDefinition<T>[]

  /**
   * The key used to uniquely identify rows in the DataTable.
   */
  rowKey: Extract<keyof T, string>

  /**
   * Whether the DataTable is searchable.
   */
  searchable?: boolean

  /**
   * Whether the DataTable is responsive.
   */
  responsive?: boolean

  /**
   * Whether rows in the DataTable are hoverable.
   */
  hoverable?: boolean

  /**
   * Whether the DataTable has striped rows.
   */
  striped?: boolean

  /**
   * Whether animations are enabled for the DataTable.
   */
  motion?: boolean

  /**
   * Whether the DataTable has a fixed layout.
   */
  fixed?: boolean

  /**
   * The size of the DataTable (e.g., xs, sm, md, lg, xl).
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Additional attributes to apply to the `<table>` element.
   */
  tableAttrs?: Record<string, any>
}

/**
 * Public props for the DataTable component.
 *
 * These props include the shared props and additional configuration
 * for managing the rows in the DataTable.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type DataTablePublicProps<T extends Record<string, any>> = DataTableSharedProps<T> & {
  /**
   * The rows to display in the DataTable.
   */
  rows?: T[]
}

/**
 * Props for the DataTable component.
 *
 * This type combines the public props and any additional props
 * required for the DataTable.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type DataTableProps<T extends Record<string, any>> = DataTablePublicProps<T>

/**
 * Emits available in the DataTable component.
 *
 * These events allow communication between the DataTable and its parent.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type DataTableEmits<T extends Record<string, any>> = {
  /**
   * Emitted when the search configuration is updated.
   *
   * @param {SearchConfig<T>} value - The updated search configuration.
   */
  (e: 'update:searchConfig', value: SearchConfig<T>): void

  /**
   * Emitted when the filter configuration is updated.
   *
   * @param {FilterConfig<T>} value - The updated filter configuration.
   */
  (e: 'update:filterConfig', value: FilterConfig<T>): void

  /**
   * Emitted when the sort configuration is updated.
   *
   * @param {SortConfig<T>} value - The updated sort configuration.
   */
  (e: 'update:sortConfig', value: SortConfig<T>): void

  /**
   * Emitted when the pagination configuration is updated.
   *
   * @param {PaginationConfig} value - The updated pagination configuration.
   */
  (e: 'update:paginationConfig', value: PaginationConfig): void

  /**
   * Emitted when the selected rows are updated.
   *
   * @param {Set<Extract<keyof T, string>>} value - The updated set of selected rows.
   */
  (e: 'update:selectedRows', value: Set<Extract<keyof T, string>>): void
}

/**
 * Slots available in the DataTable component.
 *
 * These slots allow customization of the table UI and behavior.
 *
 * @template T - The type of the data being displayed in the DataTable.
 */
export type DataTableSlots<T extends Record<string, any>> = {
  /**
   * Slot for customizing the column headers.
   */
  header: { column: ColumnDefinition<T> }

  /**
   * Slot for customizing the rows.
   */
  row: { row: T }

  /**
   * Slot for customizing individual cells.
   */
  cell: {
    row: T
    column: ColumnDefinition<T>
    value: any
  }

  /**
   * Slot for customizing the row details.
   */
  details: { row: T }

  /**
   * Slot for customizing the column filters.
   */
  filter: {
    column: ColumnDefinition<T>
    filterConfig: FilterConfig<T>
  }

  /**
   * Slot for customizing the empty state of the DataTable.
   */
  empty: {}
} & {
  /**
   * Dynamic slots for customizing the column headers.
   * The slot name is dynamically generated based on the column key.
   */
  [K in ColumnKey<T> as `header-${K}`]: { row: T }
} & {
  /**
   * Dynamic slots for customizing individual cells.
   * The slot name is dynamically generated based on the column key.
   */
  [K in ColumnKey<T> as `cell-${K}`]: {
    row: T
    column: ColumnDefinition<T>
    value: any
  }
} & {
  /**
   * Dynamic slots for customizing the column filters.
   * The slot name is dynamically generated based on the column key.
   */
  [K in ColumnKey<T> as `filter-${K}`]: {
    column: ColumnDefinition<T>
    filterConfig: FilterConfig<T>
  }
}
