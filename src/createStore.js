import { isThenable, isFn } from './types'

let createStore = (reducer, initialState = {}) => {

	if (isFn(reducer)) {
		throw new Error('Expected the reducer to be a function.')
	}

	let currentState = initialState
	let currentReducer = reducer
	let getState = () => currentState
	let replaceState = nextState => currentState = nextState

	let listeners = []
	let subscribe = listener => {
		let index = listeners.length
		listeners.push(listener)
		return () => listeners.splice(index, 1)
	}

	let isDispatching = false
	let dispatch = (key, value) => {
		if (isDispatching) {
	      throw new Error('reducer may not dispatch actions.');
	    }

		let nextState
		try {
	      isDispatching = true
	      nextState = currentReducer(key, value)
	    } finally {
	      isDispatching = false
	    }

	    if (isThenable(nextState)) {
	    	return nextState.then(result => {
	    		currentState = result
	    		listeners.forEach(listener => listener())
	    		return currentState
	    	})
	    }

	    currentState = nextState
	    listeners.forEach(listener => listener())

	    return currentState
	}

	return {
		dispatch,
		getState,
		replaceState,
		subscribe
	}
}

export default createStore