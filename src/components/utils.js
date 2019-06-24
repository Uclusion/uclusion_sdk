/**
 * Unpacks a result body and returns just the data portion
 * @param result the result body
 * @returns {*} the data portion of the body
 */
export const dataResolver = (result) => { return result.data };