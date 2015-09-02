//life cycle key
let LIFE_CYCLE = {
	SHOULD_DISPATCH: '@SHOULD_DISPATCH',
	DISPATCH: '@DISPATCH',
	SHOULD_UPDATE: '@SHOULD_UPDATE',
	WILL_UPDATE: '@WILL_UPDATE',
	DID_UPDATE: '@DID_UPDATE',
	THROW_ERROR: '@THROW_ERROR',
	ASYNC_START: '@ASYNC_START',
	ASYNC_END: '@ASYNC_END',
	SYNC: '@SYNC'
}

let ERROR_KEY = {
	'001': 'createDispatche(table): Expected table to be an object',
	'002': 'dispatch(key, value): Expected the key not to be null or undefined',
	'003': 'combineHandlers(...handlers): Expected all of handlers to be object type',
	'004': 'createStore(rootDispatch, initialState): Expected the rootDisaptch to be a function',
	'005': 'store.replaceState(nextState): Expected nextState to be an object',
	'006': 'store.dispatch(key, value): handler may not dispatch anything'
}

export default {
	LIFE_CYCLE,
	ERROR_KEY
}