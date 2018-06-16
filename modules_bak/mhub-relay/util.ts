"use strict";

export type MaybeArray<T> = T|T[];

/**
 * Cast a single element to an array, if necessary.
 */
export function ensureArray<T>(maybeArray: MaybeArray<T>): T[] {
	if (Array.isArray(maybeArray)) {
		return maybeArray;
	} else {
		return [maybeArray];
	}
}
