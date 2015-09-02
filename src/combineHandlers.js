import createDispatch from './createDispatch'
import { ERROR_KEY } from './constants'
import { isObj } from './types'

export default (...handlers) => {
	let rootHandler = {}
	let addItem = dispatch => key => {
		if (!rootHandler[key]) {
			rootHandler[key] = []
		}
		rootHandler[key].push(value => dispatch(key, value))
	}
	handlers.forEach(handler => {
		if (!isObj(handler)) {
			throw new Error(ERROR_KEY['003'])
		}
		Object.keys(handler).forEach(addItem(createDispatch(handler)))
	})
	return createDispatch(rootHandler)
}