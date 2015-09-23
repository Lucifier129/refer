import { isThenable, isFn, isObj, isArr } from './types'
import combineHandlers from './combineHandlers'
import createDispatch from './createDispatch'
import { 
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
	let replaceState = nextState => {
		currentState = nextState
		listeners.forEach(listener => listener())
	}
	let updateCurrentState = data => {
		if (rootDisaptch(SHOULD_UPDATE, data) !== false) {
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

		rootDisaptch(DISPATCH, currentData)
		if (rootDisaptch(SHOULD_DISPATCH, currentData) === false) {
			return currentState
		}

		let nextState
		try {
			isDispatching = true
			nextState = rootDisaptch([key, getNextState], value)
		} catch(error) {
	    	return dispatchError(error) // return Promise.reject
	    } finally {
	    	isDispatching = false
	    }

	    if (nextState === currentState) {
	    	return currentState
	    }

	    let data = { currentState, nextState, key, value }

		rootDisaptch(WILL_UPDATE, data)

	    if (!isThenable(nextState)) {
	    	updateCurrentState(data)
	    	rootDisaptch(SYNC, data)
	    	return currentState
	    }

	    rootDisaptch(ASYNC_START, data)
	    return nextState.then(nextState => {
	    	let data = { currentState, nextState, key, value }
	    	updateCurrentState(data)
	    	rootDisaptch(ASYNC_END, data)
	    	return currentState
	    }).catch(error => {
	    	rootDisaptch(ASYNC_END, { currentState, key, value })
	    	return dispatchError(error) // return Promise.reject
	    })
	}

	return {
		dispatch,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore