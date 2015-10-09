import createDispatch from './createDispatch'
import { isArr } from './types'

let combineHandlers = (...handlers) => handlers.reduce((rootHandler, handler) => {
	if (isArr(handler)) {
		handler = combineHandlers(...handler)
	}
	let dispatch = createDispatch(handler)
	return Object.keys(handler).reduce((rootHandler, key) => {
		if (!rootHandler[key]) {
			rootHandler[key] = []
		}
		rootHandler[key].push(value => dispatch(key, value))
		return rootHandler
	}, rootHandler)
}, {})

export default combineHandlers
