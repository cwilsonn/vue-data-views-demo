/**
 * Unboxes values from promises, functions, arrays and arrays recursively.
 *
 * Will stop at `limit` recursions. If `0` is provided will recurse until there
 * is nothing left to unbox.
 *
 * @example
 * Basic examples
 * Unbox<()=>number> // number
 * Unbox<string> // string
 * Unbox<boolean[]> // boolean
 * Unbox<Promise<boolean>> // boolean
 * Unbox<() => Promise<() => Array<Promise<boolean>>>> // boolean
 *
 * Recursive examples
 * Unbox<() => () => () => () => number> // number
 * Unbox<() => () => () => () => number, 3> // () => number
 * Unbox<() => Promise<() => Array<Promise<boolean>>>> // boolean
 */
export type Unbox<T, Level extends number = 0, Visited extends number[] = [1]> =
  T extends Promise<infer V>
    ? ContinueUnboxing<V, Level, Visited>
    : T extends (infer V)[]
      ? ContinueUnboxing<V, Level, Visited>
      : T extends (...args: unknown[]) => infer V
        ? ContinueUnboxing<V, Level, Visited>
        : T;

type ContinueUnboxing<
  T,
  L extends number,
  V extends number[],
> = L[] extends never[]
  ? Unbox<T, L>
  : L extends V['length']
    ? T
    : Unbox<T, L, [...V, 1]>;
