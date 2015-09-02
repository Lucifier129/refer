import { isObj, isArr, isFn, isStr, isNum, isThenable } from './types'
import mapValues from './mapValues'

let createDispatche = table => {
	if (!isObj(table)) {
		throw new Error(`createDispatche need an object type parameter, not ${ table }`)
	}
	let dispatch = (key, value) => {
		let handler
		switch (true) {
		case key == null:
			throw new Error(`The key ${ key } in dispatch(key, value) is illegal`)
		case isFn(key) || isArr(key) || isThenable(key) || isObj(key):
			handler = key
			break
		default:
			handler = table[key]
		}

		switch (true) {
		case handler == null:
			return value
		case isFn(handler):
			return handler(value)
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