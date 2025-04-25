/**
 * A constant object defining all available sort orders.
 * These keys are used to identify the sort direction.
 */
export const sortOrders = {
  asc: 'asc',
  desc: 'desc',
} as const;

/**
 * A mapping of sort orders to their human-readable labels.
 * These labels are typically used in UI components.
 */
export const sortLabels = {
  asc: 'ascending',
  desc: 'descending',
};

/**
 * A mapping of sort orders to their short labels.
 * These are useful for compact UI displays.
 */
export const sortLabelsShort = {
  asc: 'asc',
  desc: 'desc',
};

/**
 * A mapping of sort orders to their symbolic representations.
 * These symbols are useful for visual indicators in UI components.
 */
export const sortLabelSymbols = {
  asc: '↑',
  desc: '↓',
};

/**
 * A mapping of sort orders to their corresponding icon names.
 * These icons can be used in UI components to represent the sort direction.
 */
export const sortIcons = {
  asc: 'tabler:caret-up-filled',
  desc: 'tabler:caret-down-filled',
};
