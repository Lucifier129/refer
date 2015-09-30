import { isObj, isArr, isFn, isStr, isNum, isThenable } from './types'
import mapValues from './mapValues'
import { GET_TABLE } from './constants'

let createDispatche = table => {
	if (!isObj(table)) {
		throw new Error(`createDispatche(table): Expected table to be an object which is ${ table }`)
	}
	let dispatch = (key, value) => {
		let handler
		switch (true) {
		case key === null:
			return value
		case key === undefined:
			throw new Error(`dispatch(key, value): Expected the key not to be undefined`)
		case key === GET_TABLE:
			return table // special key to get table
		case isStr(key) || isNum(key):
			handler = table[key]
			break
		default:
			handler = key
		}

		switch (true) {
		case handler == null:
			return value
		case isFn(handler):
			return isThenable(value) ? value.then(handler) : handler(value)
		case isStr(handler) || isNum(handler):
			return dispatch(handler, value)
		case isArr(handler):
			return dispatchOnList(handler, value)
		case isThenable(handler):
			return handler.then(asyncHandler => dispatch(asyncHandler, value))
		case isObj(handler):
			return mapValues(handler, item => dispatch(item, value))
		default:
			return value
		}
	}
	let dispatchOnList = (handlers, value) => {
		for (var i = 0, len = handlers.length; i < len; i++) {
			value = dispatch(handlers[i], value)
			if (isThenable(value)) {
				return i === len - 1 ?
				value :
				value.then(result => dispatch(handlers.slice(i + 1), result))
            }
        }
        return value
	}

	return dispatch
}

export default createDispatche