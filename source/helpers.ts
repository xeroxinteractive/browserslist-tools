import { Filters } from './types';

export function filter<T>(value: T, filters: Filters<T>): boolean {
    const { include, exclude } = filters;
    return (!include.length || include.includes(value)) && (!exclude.length || !exclude.includes(value));
}