import { isThenable, isFn, isObj, isArr } from './types'
import combineHandlers from './combineHandlers'
import createDispatch from './createDispatch'
import mapValues from './mapValues'
import { 
	GET_TABLE,
	SHOULD_DISPATCH,
	DISPATCH,
	WILL_UPDATE,
	SHOULD_UPDATE,
	DID_UPDATE,
	THROW_ERROR,
	ASYNC_START,
	ASYNC_END,
	SYNC
} from './constants'

let createStore = (rootDisaptch, initialState = {}) => {

	if (isArr(rootDisaptch)) {
		rootDisaptch = createDispatch(combineHandlers(...rootDisaptch))
	} else if (isObj(rootDisaptch)) {
		rootDisaptch = createDispatch(rootDisaptch)
	}

	if (!isFn(rootDisaptch)) {
		throw new Error(`Expected the rootDisaptch to be a function which is ${ rootDisaptch }`)
	}

	let listeners = []
	let subscribe = listener => {
		listeners.push(listener)
		return () => {
			let index = listeners.indexOf(listener)
			if (index !== -1) {
				listeners.splice(index, 1)
			}
		}
	}

	let currentState = initialState
	let replaceState = (nextState, silent) => {
		currentState = nextState
		if (!silent) {
			listeners.forEach(listener => listener())
		}
	}
	let updateCurrentState = data => {
		if (rootDisaptch(SHOULD_UPDATE, data) !== false) {
			rootDisaptch(WILL_UPDATE, data)
			replaceState(data.nextState)
			rootDisaptch(DID_UPDATE, data)
		}
	}

	let getState = () => currentState
	let getNextState = f => f(currentState)
	let dispatchError = error => Promise.reject(rootDisaptch(THROW_ERROR, error))

	let isDispatching = false
	let dispatch = (key, value) => {
		if (isDispatching) {
			throw new Error(`store.dispatch(key, value): handler may not dispatch`)
		}

		let currentData = { currentState, key, value }

		if (rootDisaptch(SHOULD_DISPATCH, currentData) === false) {
			return currentState
		}

		rootDisaptch(DISPATCH, currentData)

		let nextState
		try {
			isDispatching = true
			nextState = rootDisaptch([key, getNextState], value)
		} catch(error) {
	    	return dispatchError(error)
	    } finally {
	    	isDispatching = false
	    }

	    if (nextState === currentState) {
	    	return currentState
	    }

	    let data = { currentState, nextState, key, value }

	    if (!isThenable(nextState)) {
	    	updateCurrentState(data)
	    	rootDisaptch(SYNC, data)
	    	return currentState
	    }

	    rootDisaptch(ASYNC_START, data)
	    return nextState.then(nextState => {
	    	let data = { currentState, nextState, key, value }
	    	rootDisaptch(ASYNC_END, data)
	    	updateCurrentState(data)
	    	return currentState
	    }).catch(error => {
	    	rootDisaptch(ASYNC_END, { currentState, key, value, error })
	    	return dispatchError(error)
	    })
	}

	let createActions = obj => mapValues(obj, (_, key) => value => dispatch(key, value))
	let actions = createActions(rootDisaptch(GET_TABLE))

	return {
		dispatch,
		actions,
		getState,
		replaceState,
		subscribe,
		createActions
	}
}

export default createStore