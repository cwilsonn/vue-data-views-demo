import { ref, type Ref, unref, computed, type WritableComputedRef, watchEffect } from 'vue'

/**
 * Ensures a model ref (typically created via `defineModel`) is hydrated with a default value
 * if one is not provided by the parent. This avoids the reactivity loss that occurs when relying
 * on the `default` option in `defineModel`.
 *
 * @template T The type of the model value.
 * @param {Ref<T | undefined>} modelRef - The externally-controlled model ref, usually from `defineModel`.
 * @param {T | Ref<T>} defaultValue - The default value used to hydrate the model if it's initially undefined.
 * @returns {WritableComputedRef<T>} A reactive, always-defined ref that updates the original model.
 *
 * @example
 * const model = defineModel<number>('value'); // no default
 * const safeModel = useHydratedModel(model, 42);
 * // safeModel is now guaranteed to be a reactive number ref with an initial value of 42 if none was provided.
 */
export function useHydratedModel<T>(
  modelRef: Ref<T | undefined>,
  defaultValue: T | Ref<T>,
): WritableComputedRef<T> {
  const fallbackValue = ref<T>(unref(defaultValue))

  // Hydrate the modelRef if the parent did not provide one
  watchEffect(() => {
    if (modelRef.value === undefined) {
      modelRef.value = fallbackValue.value
    }
  })

  return computed({
    get: () => modelRef.value as T,
    set: (value: T) => {
      modelRef.value = value
    },
  }) as WritableComputedRef<T>
}
