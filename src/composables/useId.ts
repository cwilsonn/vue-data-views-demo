// Third-party
import { ref, type Ref } from 'vue';
import { nanoid } from 'nanoid';

/**
 * Generates a component-scoped unique ID.
 * Memoized so it only generates once per usage.
 *
 * @param {string} [prefix] - Optional prefix for the ID (e.g., 'input', 'select', etc.)
 * @param {number} [length=6] - Optional length of the ID. Default is 6.
 * @returns {Ref<string>} A stable ID string like `input-abc123`
 *
 * @example
 * const id = useId('input')
 * console.log(id.value) // 'input-abc123'
 */
export function useId(prefix?: string, length: number = 6): Ref<string> {
  const id = ref(`${prefix ? `${prefix}-` : ''}${nanoid(length)}`);

  return id;
}
