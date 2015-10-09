/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj The source object.
 * @param {Function} fn The mapper function that receives the value and the key.
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
let mapValues = (obj, fn) => Object.keys(obj).reduce((result, key) => {
	result[key] = fn(obj[key], key)
	return result
}, {})

export default mapValues