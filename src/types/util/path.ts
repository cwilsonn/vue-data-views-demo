/**
 * A utility type to represent all possible string paths to properties
 * within a deeply nested object.
 *
 * This is useful for scenarios where you need to reference object properties
 * dynamically, such as in filtering, sorting, or accessing nested data.
 *
 * NOTE: This type is not currently being used in this demo application. It was added in order
 * to provide an extension point to enable dot-notation based access to nested properties
 * in various data view displays and configuration.
 * 
 * @example
 * type Example = {
 *   user: {
 *     name: string;
 *     address: {
 *       city: string;
 *       zip: number;
 *     };
 *   };
 * };
 *
 * Path<Example> // "user" | "user.name" | "user.address" | "user.address.city" | "user.address.zip"
 */

/**
 * A type representing primitive values that are considered "leaf nodes"
 * in an object structure.
 */
type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/**
 * A utility type to determine if a given type `T` is a "leaf node."
 * Leaf nodes are primitive values, `Date`, `Function`, or arrays.
 *
 * @template T - The type to check.
 */
type IsLeaf<T> = T extends Primitive | Date | Function | Array<any>
  ? true
  : false;

/**
 * Recursively generates string paths for all properties of an object `T`.
 *
 * @template T - The object type to generate paths for.
 * @template K - The current key being processed.
 */
type PathImpl<T, K extends keyof T> = K extends string
  ? IsLeaf<T[K]> extends true
    ? K
    : T[K] extends object
      ? K | `${K}.${PathImpl<T[K], keyof T[K]>}`
      : K
  : never;

/**
 * A utility type to generate all possible string paths for an object `T`.
 *
 * @template T - The object type to generate paths for.
 */
export type Path<T> = PathImpl<T, Extract<keyof T, string>>;
