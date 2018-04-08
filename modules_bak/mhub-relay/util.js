"use strict";
/**
 * Cast a single element to an array, if necessary.
 */
function ensureArray(maybeArray) {
    if (Array.isArray(maybeArray)) {
        return maybeArray;
    }
    else {
        return [maybeArray];
    }
}
exports.ensureArray = ensureArray;
//# sourceMappingURL=util.js.map