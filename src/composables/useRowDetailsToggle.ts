// Third-party
import { ref } from 'vue';

/**
 * A composable for managing the expanded state of rows in a table.
 *
 * @template K The type of the row keys (e.g., string, number, or a custom type).
 * @returns {object} An object containing methods and state for managing expanded rows.
 *
 * @example
 * const { expandedRowKeys, toggleRowDetails, isRowExpanded, clearExpandedRows } = useRowDetailsToggle<number>();
 *
 * toggleRowDetails(1); // Expands row with key 1
 * console.log(isRowExpanded(1)); // true
 * clearExpandedRows(); // Collapses all rows
 */
export function useRowDetailsToggle<K = string | number>() {
  const expandedRowKeys = ref<Set<K>>(new Set<K>()) as { value: Set<K> };

  /**
   * Toggles the expanded state of a row based on its key.
   * @param {K} key - The key of the row to toggle.
   * @returns {void}
   */
  const toggleRowDetails = (key: K) => {
    expandedRowKeys.value.has(key)
      ? expandedRowKeys.value.delete(key)
      : expandedRowKeys.value.add(key);
  };

  /**
   * Checks if a row is expanded based on its key.
   * @param {K} key - The key of the row to check.
   * @returns {boolean}
   */
  const isRowExpanded = (key: K) => expandedRowKeys.value.has(key);

  // Clears all expanded rows, collapsing them.
  const clearExpandedRows = () => expandedRowKeys.value.clear();

  /**
   * Expands all rows based on the provided keys.
   * @param {K[]} keys - The keys of the rows to expand.
   * @returns {void}
   */
  const expandAllRows = (keys: K[]) => {
    keys.forEach((key) => expandedRowKeys.value.add(key));
  };

  // Collapses all rows.
  const collapseAllRows = () => expandedRowKeys.value.clear();

  return {
    expandedRowKeys,
    toggleRowDetails,
    isRowExpanded,
    clearExpandedRows,
    expandAllRows,
    collapseAllRows,
  };
}
