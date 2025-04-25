// Third-party
import { computed, type Ref } from 'vue';
import { orderBy as _orderBy } from 'lodash-es';

// Types
import type { SortConfig } from '@/types/composables/useSort.types';

/**
 * A composable for sorting a reactive array of data.
 *
 * @template T The type of each item in the dataset.
 * @param {Ref<T[]>} data - A reactive array of data to be sorted.
 * @param {Ref<SortConfig<T>>} config - A reactive sort configuration object, including the key, order, and an optional custom sort function.
 * @returns {object} An object containing the sorted data as a computed ref and utility methods for managing sorting.
 *
 * @example
 * const data = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
 * const config = ref({ key: 'name', order: 'asc' });
 * const { sortedData, cycleSort } = useSort(data, config);
 *
 * console.log(sortedData.value); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 *
 * cycleSort('name'); // Toggles the sort order for the 'name' key
 */
export function useSort<T extends Record<string, any>>(
  data: Ref<T[]>,
  config: Ref<SortConfig<T>>,
) {
  const sortedData = computed<T[]>(() => {
    const { key, order, sortFn } = config.value;
    if (!key || !order) return data.value;

    // If a custom sort function is provided, it takes precedence
    if (sortFn) {
      return [...data.value].sort((a, b) => {
        const result = sortFn(a, b);
        return order === 'desc' ? -result : result;
      });
    }

    return _orderBy(data.value, [key], [order]);
  });

  /**
   * Cycles the sort order for a given key.
   * @param {keyof T} key - The key to sort by.
   * @returns {void}
   */
  const cycleSort = (key: Extract<keyof T, string>) => {
    if (config.value.key !== key) {
      config.value = { key, order: 'asc' };
    } else if (config.value.order === 'asc') {
      config.value.order = 'desc';
    } else {
      config.value = { key: null, order: null };
    }
  };

  // Resets the sort config to its default state.
  const resetSort = () => (config.value = { key: null, order: null });

  return {
    sortedData,
    cycleSort,
    resetSort,
  };
}
