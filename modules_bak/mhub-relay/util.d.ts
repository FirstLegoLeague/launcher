export declare type MaybeArray<T> = T | T[];
/**
 * Cast a single element to an array, if necessary.
 */
export declare function ensureArray<T>(maybeArray: MaybeArray<T>): T[];
