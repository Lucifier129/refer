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

let merge = next => current => Object.assign({}, current, next)

let createStore = (rootDisaptch, initialState = {}) => {
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
		return currentState
	}
	let updateCurrentState = data => {
		if (rootDisaptch(SHOULD_UPDATE, data) !== false) {
			replaceState(data.nextState)
			rootDisaptch(DID_UPDATE, data)
		}
	}

	let getState = () => currentState
	let getNextState = f => f(currentState)
	let dispatchError = error => rootDisaptch(THROW_ERROR, error)

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
		rootDisaptch(WILL_UPDATE, currentData)

		let nextState
		try {
			isDispatching = true
			nextState = rootDisaptch([key, getNextState], value)
		} catch(error) {
	    	dispatchError(error)
	    	return currentState
	    } finally {
	    	isDispatching = false
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
	    	updateCurrentState(data)
	    	rootDisaptch(ASYNC_END, data)
	    	return currentState
	    }, dispatchError)
	}

	let combine = (mapping, subDispatch) => (key, value) => {
		return dispatch([mapping, merge], subDispatch(key, value))
	}

	return {
		dispatch,
		combine,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore