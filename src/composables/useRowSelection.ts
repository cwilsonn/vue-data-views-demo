// Third-party
import { ref, type Ref } from 'vue';

/**
 * A composable for managing row selection state in tables, lists, etc.
 *
 * @template K The type of the row keys (e.g., string or number).
 * @param {Ref<Set<K>>} [externalSelectedKeys] - An optional external shallow ref to manage selected keys.
 * @returns {object} An object containing methods and state for managing row selection.
 *
 * @example
 * const { selectedKeys, toggleSelection, selectAll, deselectAll, areAllSelected, isIndeterminate } = useRowSelection<number>();
 *
 * toggleSelection(1); // Selects row with key 1
 * console.log(selectedKeys.value); // Set { 1 }
 * selectAll([1, 2, 3]); // Selects rows with keys 1, 2, and 3
 * console.log(areAllSelected([1, 2, 3])); // true
 */
export function useRowSelection<K extends string | number>(
  externalSelectedKeys?: Ref<Set<K>>,
) {
  // Internal state for selected keys if no external ref is provided
  const internalSelectedKeys = ref<Set<K>>(new Set()) as { value: Set<K> };
  const selectedKeys = externalSelectedKeys ?? internalSelectedKeys;

  /**
   * Checks if a row is selected based on its key.
   * @param {K} key - The key of the row to check.
   * @returns {boolean}
   */
  const isSelected = (key: K): boolean => selectedKeys.value.has(key);

  /**
   * Toggles the selection state of a row based on its key.
   * @param {K} key - The key of the row to toggle.
   * @returns {void}
   */
  const toggleSelection = (key: K) => {
    const next = new Set(selectedKeys.value);
    isSelected(key) ? next.delete(key) : next.add(key);
    selectedKeys.value = next;
  };

  /**
   * Selects all rows based on the provided keys.
   * @param {K[]} keys - The keys of the rows to select.
   * @returns {void}
   */
  const selectAll = (keys: K[]) => {
    const next = new Set(selectedKeys.value);
    keys.forEach((key) => next.add(key));
    selectedKeys.value = next;
  };

  // Deselects all selected row keys.
  const deselectAll = () => {
    selectedKeys.value = new Set();
  };

  /**
   * Checks if all rows in the given array of keys are selected.
   * @param {K[]} keys - The keys of the rows to check.
   * @returns {boolean}
   */
  const areAllSelected = (keys: K[]): boolean =>
    keys.length > 0 && keys.every((key) => isSelected(key));

  /**
   * Checks if the selection state is indeterminate (some but not all selected) for the given keys.
   * @param {K[]} keys - The keys of the rows to check.
   * @returns {boolean}
   */
  const isIndeterminate = (keys: K[]): boolean => {
    if (!keys.length) return false;
    const selected = keys.filter((key) => isSelected(key)).length;
    return selected > 0 && selected < keys.length;
  };

  /**
   * Returns the currently selected row keys as an array.
   * @returns {K[]}
   */
  const getSelectedKeys = (): K[] => Array.from(selectedKeys.value);

  return {
    selectedKeys,
    isSelected,
    toggleSelection,
    selectAll,
    deselectAll,
    areAllSelected,
    isIndeterminate,
    getSelectedKeys,
  };
}
