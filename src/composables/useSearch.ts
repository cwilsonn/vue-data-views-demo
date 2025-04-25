// Third-party
import { type Ref, unref, ref, computed, watch } from 'vue';
import { filter as _filter, debounce as _debounce } from 'lodash-es';

// Types
import { type SearchConfig } from '@/types/composables/useSearch.types';

/**
 * A composable that provides a basic keyword search functionality
 * across specified object keys in an array of objects.
 *
 * @template T - The type of the object entries in the array.
 * @param {Ref<T[]>} data - A ref to an array of data to be searched.
 * @param {Ref<SearchConfig<T>> | SearchConfig<T>} config - A reactive or plain search config object including keys, the query string, and case-sensitivity.
 * @returns {object} An object containing the filtered data as a computed ref.
 *
 * @example
 * const data = ref([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
 * const config = ref({ query: 'alice', keys: ['name'], caseSensitive: false });
 * const { searchedData } = useSearch(data, config);
 *
 * console.log(searchedData.value); // [{ id: 1, name: 'Alice' }]
 */
export function useSearch<T extends Record<string, any>>(
  data: Ref<T[]>,
  config: Ref<SearchConfig<T>> | SearchConfig<T>,
) {
  // Normalize the config to handle both reactive and plain objects
  const normalizedConfig = computed(() => unref(config))

  const debouncedQuery = ref<string>('')

  watch(
    () => normalizedConfig.value.query,
    _debounce((newQuery) => {
      debouncedQuery.value = newQuery
    }, 150)
  )

  /**
   * Utility function to normalize a string for searching.
   * @param value - The value to be normalized.
   * @param caseSensitive - A flag indicating whether the search should be case-sensitive.
   * @returns {string} - The normalized string.
   */
  const normalizeString = (value: any, caseSensitive: boolean): string => {
    if (typeof value !== 'string') {
      try {
        value = JSON.stringify(value)
      } catch {
        return ''; // Return an empty string if value cannot be stringified
      }
    }
    return caseSensitive ? value : value.toLowerCase()
  }

  const searchedData = computed(() => {
    const { keys, caseSensitive = false } = normalizedConfig.value ?? {}
    const query = debouncedQuery.value
    if (!query || !keys || keys.length === 0) return data.value

    const normalizedQuery = normalizeString(query, caseSensitive)

    return _filter(data.value, (item) =>
      keys.some((key) => {
        const value = item[key];
        const normalizedValue = normalizeString(value, caseSensitive)
        return normalizedValue.includes(normalizedQuery)
      }),
    );
  })

  return { searchedData };
}
