// Utils
import { filterConditions } from '@/utils/useFilter.util';

/**
 * A type representing all available filter condition keys.
 * These keys correspond to the condition functions defined in `filterConditions`.
 */
export type FilterCondition = keyof typeof filterConditions | null;

/**
 * Represents a single filter group for a specific key in the data.
 *
 * @template T - The type of the data being filtered.
 */
export type FilterGroup<T = unknown> = {
  /**
   * The condition to use for filtering (e.g., 'eq', 'lt', 'regex').
   * If omitted, no filtering will be applied for this key.
   */
  condition?: FilterCondition | undefined;

  /**
   * The value to compare against.
   * This can be a primitive value, an array, or any other type depending on the condition.
   */
  value?: any;

  /**
   * An optional custom filter function for this key.
   * If defined, it takes precedence over the condition behavior.
   *
   * @param {T} item - The current item being filtered.
   * @returns {boolean} - Whether the item passes the filter.
   */
  filterFn?: (item: T) => boolean;
};

/**
 * Represents the filter configuration for a dataset.
 * Each key corresponds to a property in the dataset, and its value is a `FilterGroup`.
 *
 * @template T - The type of the data being filtered.
 *
 * @example
 * type Example = {
 *   id: number;
 *   name: string;
 *   age: number;
 * };
 *
 * const filterConfig: FilterConfig<Example> = {
 *   name: { condition: 'eq', value: 'Alice' },
 *   age: { condition: 'gte', value: 18 },
 * };
 */
export type FilterConfig<T extends Record<string, any>> = Partial<
  Record<Extract<keyof T, string>, FilterGroup<T>>
>;
