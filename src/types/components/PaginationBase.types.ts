/**
 * Shared props for the `PaginationBase` component.
 *
 * These props define the basic configuration for pagination, such as the total number of entries,
 * the number of page buttons to display, and optional controls for navigation.
 */
export type PaginationBaseSharedProps = {
  /**
   * The total number of entries in the dataset.
   */
  total: number

  /**
   * Whether the pagination controls are disabled.
   */
  disabled?: boolean

  /**
   * Whether to display "First" and "Last" navigation buttons.
   */
  showFirstLast?: boolean

  /**
   * Whether to display "Previous" and "Next" navigation buttons.
   */
  showPrevNext?: boolean

  /**
   * Whether to display a dropdown to dynamically control the `perPage` value.
   */
  dynamicPerPage?: boolean

  /**
   * The total number of page buttons to display at a given time.
   */
  maxButtons?: number

  /**
   * The size of the pagination button elements and optional perPage select input
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Public props for the `PaginationBase` component.
 *
 * These props extend the shared props and include additional configuration
 * for managing the current page and the number of entries per page.
 */
export type PaginationBasePublicProps = PaginationBaseSharedProps & {
  /**
   * The current page number (1-based index).
   */
  page?: number

  /**
   * The number of entries to display per page.
   */
  perPage?: number
}

export type PaginationEmits = {
  (e: 'update:page', value: number): void
  (e: 'update:perPage', value: number): void
}

