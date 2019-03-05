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
