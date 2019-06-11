/* eslint-disable @typescript-eslint/no-explicit-any */
import { Filters } from './types';

/**
 * Determines whether a given value should be filtered out or not, using an array of valid include values and invalid exclude values.
 *
 * @param value - The value to check against the include and exclude filters.
 * @param filters - The filters to check the given value against, include and exclude.
 * @returns Whether the value should be filtered out.
 */
export function filter<T>(value: T, filters?: Filters<T>): boolean {
  const { include = [], exclude = [] } = filters || {};
  return (
    (!include.length || include.includes(value)) &&
    (!exclude.length || !exclude.includes(value))
  );
}

/**
 * Exclusive OR.
 *
 * @param lhs - Left hand side.
 * @param rhs - Right hand side.
 * @returns Whether the lhs is true and rhs isn't or rhs is true and lhs isn't.
 */
export function xor(lhs: boolean, rhs: boolean): boolean {
  return (lhs && !rhs) || (!lhs && rhs);
}

/**
 * Check if the value of 2 arrays are equal.
 *
 * @param array1 - First array to compare.
 * @param array2 - Second array to compare.
 * @returns Whether the arrays are equal by value.
 */
export function arraysEqual(array1: any[], array2: any[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let index in array1) {
    const item1 = array1[index];
    const item2 = array2[index];
    const type1 = typeof item1;
    const type2 = typeof item2;
    if (type1 !== type2) {
      return false;
    }
    if (type1 === 'object') {
      const isArray1 = Array.isArray(item1);
      const isArray2 = Array.isArray(item2);
      if (isArray1 && isArray2 && !arraysEqual(item1, item2)) {
        return false;
      } else if (xor(isArray1, isArray2)) {
        return false;
        // Not the most efficient way to do this, but this is currently only being used for testing.
      } else if (JSON.stringify(item1) !== JSON.stringify(item2)) {
        return false;
      }
    } else if (item1 !== item2) {
      return false;
    }
  }
  return true;
}
