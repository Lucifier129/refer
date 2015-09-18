import createDispatch from './createDispatch'

export default (...handlers) => handlers.reduce((rootHandler, handler) => {
	let dispatch = createDispatch(handler)
	return Object.keys(handler).reduce((rootHandler, key) => {
		if (!rootHandler[key]) {
			rootHandler[key] = []
		}
		rootHandler[key].push(value => dispatch(key, value))
		return rootHandler
	}, rootHandler)
}, {})