import { isThenable, isFn, isObj } from './types'
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
	if (!isFn(rootDisaptch)) {
		throw new Error('Expected the rootDisaptch to be a function.')
	}

	let listeners = []
	let subscribe = listener => {
		let index = listeners.length
		listeners.push(listener)
		return () => {
			let index = listeners.indexOf(listener)
			if (index !== -1) {
				listeners.splice(index, 1)
			}
		}
	}

	let currentState = initialState
	let getState = () => currentState
	let getNextState = f => f(currentState)
	let replaceState = nextState => {
		if (!isObj(nextState)) {
			throw new Error(`The next state must be a object type, not ${ nextState }`)
		}
		currentState = nextState
		listeners.forEach(listener => listener())
		return currentState
	}
	let updateCurrentState = data => {
		if (rootDisaptch(SHOULD_UPDATE, data) !== false) {
			replaceState(data.nextState)
			rootDisaptch(DID_UPDATE, data)
		}
		return currentState
	}
	let dispatchError = error => {
		rootDisaptch(THROW_ERROR, error)
		return currentState
	}

	let isDispatching = false
	let dispatch = (key, value) => {
		if (isDispatching) {
			throw new Error('handler may not dispatch anything.')
		}

		let currentData = { currentState, key, value }

		if (rootDisaptch(SHOULD_DISPATCH, currentData) === false) {
			return currentState
		}

		rootDisaptch(DISPATCH, currentData)
		rootDisaptch(WILL_UPDATE, currentData)

		let nextState
		try {
			isDispatching = true
			nextState = rootDisaptch([key, getNextState], value)
		} catch(error) {
			rootDisaptch(THROW_ERROR, error)
	    	return currentState
	    } finally {
	    	isDispatching = false
	    }

	    let data = { currentState, nextState, key, value }

	    if (isThenable(nextState)) {
	    	rootDisaptch(ASYNC_START, data)
	    	return nextState
	    		.then(nextState => 
	    			updateCurrentState(
	    				rootDisaptch(ASYNC_END, { currentState, nextState, key, value })
	    			)
	    		, dispatchError)
	    }
	    return updateCurrentState(rootDisaptch(SYNC, data))
	}

	return {
		dispatch,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore