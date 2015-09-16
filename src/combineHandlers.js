import createDispatch from './createDispatch'
import { isObj } from './types'

export default (...handlers) => {
	let rootHandler = {}
	let addItem = dispatch => key => {
		if (!rootHandler[key]) {
			rootHandler[key] = []
		}
		rootHandler[key].push(value => dispatch(key, value))
	}
	handlers.forEach(handler => Object.keys(handler).forEach(addItem(createDispatch(handler))))
	return rootHandler
}